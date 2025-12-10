"""
G-Split Twitter Bot
Monitors @gsplitscore mentions, scores pint photos, and replies with roasts.
"""

import tweepy
import requests
import os
import time
from datetime import datetime
from pathlib import Path
import tempfile
from models import db, TwitterSubmission
from roast_bank import get_roast, format_twitter_reply
from app import app

class GSplitTwitterBot:
    def __init__(self):
        """Initialize Twitter bot with API credentials."""
        # Twitter API v2 Client
        self.client = tweepy.Client(
            consumer_key=os.environ.get('TWITTER_API_KEY'),
            consumer_secret=os.environ.get('TWITTER_API_SECRET'),
            access_token=os.environ.get('TWITTER_ACCESS_TOKEN'),
            access_token_secret=os.environ.get('TWITTER_ACCESS_TOKEN_SECRET')
        )

        # Twitter API v1.1 for media downloads (v2 doesn't support media well yet)
        auth = tweepy.OAuth1UserHandler(
            os.environ.get('TWITTER_API_KEY'),
            os.environ.get('TWITTER_API_SECRET'),
            os.environ.get('TWITTER_ACCESS_TOKEN'),
            os.environ.get('TWITTER_ACCESS_TOKEN_SECRET')
        )
        self.api_v1 = tweepy.API(auth)

        self.api_base = os.environ.get('API_BASE_URL', 'http://localhost:5001')
        self.bot_handle = '@gsplitscore'
        self.last_mention_id = None

        print(f'🤖 GSplit Twitter Bot initialized')
        print(f'   Monitoring for mentions of {self.bot_handle}')
        print(f'   API base: {self.api_base}')

    def check_mentions(self):
        """Check for new mentions and process them."""
        try:
            print(f'\n{"="*80}')
            print(f'🔍 Checking for new mentions...')

            # Get mentions (last 10, newest first)
            mentions = self.client.get_users_mentions(
                id=self.client.get_me().data.id,
                max_results=10,
                since_id=self.last_mention_id,
                expansions=['attachments.media_keys', 'author_id'],
                media_fields=['url', 'preview_image_url'],
                user_fields=['username']
            )

            if not mentions.data:
                print('   No new mentions found')
                return

            print(f'   Found {len(mentions.data)} new mention(s)')

            # Process each mention
            for tweet in reversed(mentions.data):  # Process oldest first
                print(f'\n   📝 Processing tweet {tweet.id} from @{tweet.author_id}')

                # Update last mention ID
                self.last_mention_id = tweet.id

                # Check if already processed
                with app.app_context():
                    existing = TwitterSubmission.query.filter_by(tweet_id=str(tweet.id)).first()
                    if existing:
                        print(f'      ⏭️  Already processed, skipping')
                        continue

                # Process tweet
                self.process_tweet(tweet, mentions.includes)

            print(f'{"="*80}\n')

        except Exception as e:
            print(f'❌ Error checking mentions: {e}')
            import traceback
            traceback.print_exc()

    def process_tweet(self, tweet, includes):
        """Process a single tweet with image."""
        try:
            # Extract media from includes
            media_list = includes.get('media', []) if includes else []

            if not media_list:
                print(f'      ⚠️  No images found, skipping')
                return

            # Get first image
            image_media = None
            for media in media_list:
                if media.type == 'photo':
                    image_media = media
                    break

            if not image_media:
                print(f'      ⚠️  No photo attachments, skipping')
                return

            image_url = image_media.url
            print(f'      📷 Image URL: {image_url}')

            # Download image
            image_path = self.download_image(image_url)
            if not image_path:
                print(f'      ❌ Failed to download image')
                return

            # Analyze image
            result = self.analyze_image(image_path)

            # Clean up downloaded image
            os.unlink(image_path)

            if not result or 'error' in result:
                print(f'      ❌ Analysis failed: {result.get("error", "Unknown error")}')
                return

            score = result['score']
            distance_mm = result.get('distance_from_g_line_mm', 0)

            print(f'      ✅ Analysis complete: {score}% ({distance_mm:.1f}mm)')

            # Generate roast using roast bank
            roast = get_roast(score, distance_mm)
            twitter_reply = format_twitter_reply(score, distance_mm, roast)

            print(f'      💬 Reply: "{twitter_reply}"')

            # Get author username
            author = next((u for u in includes.get('users', []) if u.id == tweet.author_id), None)
            author_handle = f'@{author.username}' if author else '@unknown'

            # Reply to tweet
            reply_id = self.reply_to_tweet(tweet.id, twitter_reply)

            if reply_id:
                print(f'      📤 Replied with tweet {reply_id}')

                # Save to database
                self.save_submission(
                    tweet_id=str(tweet.id),
                    handle=author_handle,
                    image_url=image_url,
                    score=score,
                    distance=distance_mm,
                    roast=roast,
                    reply_id=str(reply_id)
                )
                print(f'      💾 Saved to database')
            else:
                print(f'      ❌ Failed to reply')

        except Exception as e:
            print(f'      ❌ Error processing tweet: {e}')
            import traceback
            traceback.print_exc()

    def download_image(self, url):
        """Download image from Twitter URL to temp file."""
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()

            # Create temp file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
            temp_file.write(response.content)
            temp_file.close()

            return temp_file.name

        except Exception as e:
            print(f'         Error downloading image: {e}')
            return None

    def analyze_image(self, image_path):
        """Send image to /analyze-split endpoint."""
        try:
            url = f'{self.api_base}/analyze-split'

            with open(image_path, 'rb') as f:
                files = {'image': ('pint.jpg', f, 'image/jpeg')}
                response = requests.post(url, files=files, timeout=30)

            response.raise_for_status()
            return response.json()

        except Exception as e:
            print(f'         Error analyzing image: {e}')
            return {'error': str(e)}

    def reply_to_tweet(self, tweet_id, message):
        """Reply to the original tweet."""
        try:
            response = self.client.create_tweet(
                text=message,
                in_reply_to_tweet_id=tweet_id
            )
            return response.data['id']

        except Exception as e:
            print(f'         Error replying to tweet: {e}')
            return None

    def save_submission(self, tweet_id, handle, image_url, score, distance, roast, reply_id):
        """Save to TwitterSubmission table."""
        try:
            with app.app_context():
                submission = TwitterSubmission(
                    tweet_id=tweet_id,
                    twitter_handle=handle,
                    image_url=image_url,
                    score=score,
                    distance_mm=distance,
                    roast=roast,
                    reply_tweet_id=reply_id
                )
                db.session.add(submission)
                db.session.commit()

        except Exception as e:
            print(f'         Error saving to database: {e}')
            import traceback
            traceback.print_exc()

    def run(self, interval=60):
        """Run bot continuously, checking mentions every interval seconds."""
        print(f'\n🚀 Starting GSplit Twitter Bot')
        print(f'   Polling interval: {interval}s\n')

        while True:
            try:
                self.check_mentions()
                time.sleep(interval)

            except KeyboardInterrupt:
                print(f'\n\n⏸️  Bot stopped by user')
                break
            except Exception as e:
                print(f'\n❌ Unexpected error: {e}')
                import traceback
                traceback.print_exc()
                print(f'   Retrying in {interval}s...\n')
                time.sleep(interval)


if __name__ == '__main__':
    # Run bot when executed directly
    bot = GSplitTwitterBot()
    bot.run(interval=60)  # Check every 60 seconds
