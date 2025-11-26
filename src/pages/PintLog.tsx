import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Award, Calendar } from "lucide-react";

interface PintEntry {
  id: number;
  date: string;
  splitScore?: number;
  splitImage?: string;
  overallRating: number;
  location: string;
  price?: string;
}

const PintLog = () => {
  const navigate = useNavigate();
  const [pintLog, setPintLog] = useState<PintEntry[]>([]);

  useEffect(() => {
    const log = JSON.parse(localStorage.getItem("pintLog") || "[]");
    setPintLog(log);
  }, []);

  const averageSplit = pintLog.filter(p => p.splitScore).reduce((acc, p) => acc + (p.splitScore || 0), 0) / (pintLog.filter(p => p.splitScore).length || 1);
  const bestSplit = Math.max(...pintLog.map(p => p.splitScore || 0), 0);
  const averageRating = pintLog.reduce((acc, p) => acc + p.overallRating, 0) / (pintLog.length || 1);

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
            pint log
          </h1>
          <p className="text-base text-muted-foreground">
            your guinness journey
          </p>
        </div>

        {/* Stats Overview */}
        {pintLog.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-3" />
              <div className="text-4xl font-bold text-foreground mb-1">
                {averageSplit.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                average split
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Award className="w-8 h-8 text-warning mx-auto mb-3" />
              <div className="text-4xl font-bold text-foreground mb-1">
                {bestSplit}%
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                best split
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Calendar className="w-8 h-8 text-foreground mx-auto mb-3" />
              <div className="text-4xl font-bold text-foreground mb-1">
                {pintLog.length}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                pints rated
              </div>
            </div>
          </div>
        )}

        {/* Pint Entries */}
        {pintLog.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              no pints logged yet
            </p>
            <Button onClick={() => navigate("/split")} size="lg">
              rate your first pint
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {pintLog.map((entry) => (
              <div key={entry.id} className="bg-card border border-border rounded-lg p-6 hover:border-success transition-colors duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  {entry.splitImage && (
                    <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden border border-border flex-shrink-0">
                      <img
                        src={entry.splitImage}
                        alt="Pint"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {entry.location}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      {entry.price && (
                        <div className="text-base text-muted-foreground">
                          {entry.price}
                        </div>
                      )}
                    </div>

                    {/* Survey Status - Show if incomplete */}
                    {!entry.overallRating && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-3">
                          Complete your rating to unlock detailed stats
                        </p>
                        <Button
                          onClick={() =>
                            navigate("/survey", {
                              state: {
                                pintLogId: entry.id,
                                splitScore: entry.splitScore,
                                splitImage: entry.splitImage
                              }
                            })
                          }
                          size="sm"
                          className="w-full"
                        >
                          Complete Rating ⭐
                        </Button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {entry.splitScore && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                            g-split
                          </div>
                          <div className="text-3xl font-bold text-success">
                            {entry.splitScore}%
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                          rating
                        </div>
                        <div className="text-2xl text-warning">
                          {"★".repeat(entry.overallRating)}
                          <span className="text-muted/30">{"☆".repeat(5 - entry.overallRating)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PintLog;
