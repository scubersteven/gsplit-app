import { Link } from "react-router-dom";
import { Camera, Star } from "lucide-react";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {/* Hero Upload Zone */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-3 tracking-tight">
            Master the Split
          </h1>
          <p className="text-lg text-muted-foreground">
            The art of the perfect Guinness divide
          </p>
        </div>
        
        <Link to="/split">
          <div className="group relative bg-card border-2 border-border hover:border-success p-12 md:p-16 rounded-xl transition-all duration-300 hover:shadow-2xl cursor-pointer animate-fade-in">
            <div className="relative text-center space-y-6">
              <div className="inline-block p-6 bg-secondary/50 rounded-lg mb-4 group-hover:bg-success/20 transition-colors duration-300">
                <Camera className="w-16 h-16 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Upload Your Split
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Capture the perfect split and discover your accuracy score
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <div className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-base hover:scale-105 transition-transform">
                  📸 Take Photo
                </div>
                <div className="px-6 py-3 border-2 border-border text-primary rounded-lg font-medium text-base hover:scale-105 transition-transform">
                  📁 Upload Image
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Secondary Feature */}
      <div className="max-w-3xl mx-auto">
        <Link to="/survey">
          <div className="group bg-card border-2 border-border hover:border-gold p-8 rounded-xl transition-all duration-300 hover:shadow-xl cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-secondary/50 rounded-lg group-hover:bg-gold/20 transition-colors duration-300">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Rate Your Guinness
              </h2>
            </div>
            <p className="text-base text-muted-foreground mb-4">
              Comprehensive evaluation of taste, pour technique, and presentation
            </p>
            <div className="text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
              Begin Evaluation →
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
