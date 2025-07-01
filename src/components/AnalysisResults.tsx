import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AnalysisResult {
  sperm_count: number;
  confidence?: number;
  analysis_time?: number;
  image_quality?: 'excellent' | 'good' | 'fair' | 'poor';
}

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  isAnalyzing
}) => {
  if (isAnalyzing) {
    return (
      <Card className="animate-pulse-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Analyzing Sample...
          </CardTitle>
          <CardDescription>
            AI is processing your sample to detect and count sperm cells
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Processing frames</span>
                <span>Please wait...</span>
              </div>
              <Progress value={undefined} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-5 h-5" />
            Analysis Results
          </CardTitle>
          <CardDescription>
            Upload a video or image to begin sperm analysis
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCountStatus = (count: number) => {
    if (count === 0) return { icon: AlertCircle, color: 'text-destructive', status: 'No cells detected' };
    if (count < 10) return { icon: AlertCircle, color: 'text-yellow-600', status: 'Low count' };
    if (count < 50) return { icon: CheckCircle, color: 'text-blue-600', status: 'Moderate count' };
    return { icon: TrendingUp, color: 'text-green-600', status: 'High count' };
  };

  const countStatus = getCountStatus(result.sperm_count);
  const StatusIcon = countStatus.icon;

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Analysis Complete
        </CardTitle>
        <CardDescription>
          AI analysis completed successfully
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Count Result */}
        <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
          <div className="text-4xl font-bold text-primary mb-2">
            {result.sperm_count.toLocaleString()}
          </div>
          <div className="text-lg text-muted-foreground mb-3">
            Sperm Cells Detected
          </div>
          <div className={`flex items-center justify-center gap-2 ${countStatus.color}`}>
            <StatusIcon className="w-5 h-5" />
            <span className="font-medium">{countStatus.status}</span>
          </div>
        </div>

        {/* Analysis Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.confidence && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-medium">{Math.round(result.confidence)}%</span>
              </div>
              <Progress value={result.confidence} className="h-2" />
            </div>
          )}

          {result.analysis_time && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Analysis Time</span>
              <Badge variant="secondary">{result.analysis_time.toFixed(1)}s</Badge>
            </div>
          )}

          {result.image_quality && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Image Quality</span>
              <Badge 
                variant="secondary" 
                className={`${getQualityColor(result.image_quality)} text-white border-0`}
              >
                {result.image_quality.charAt(0).toUpperCase() + result.image_quality.slice(1)}
              </Badge>
            </div>
          )}
        </div>

        {/* Clinical Reference */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Clinical Reference</h4>
          <p className="text-xs text-muted-foreground">
            Normal sperm concentration: 15+ million/mL. This analysis is for research purposes only 
            and should not replace professional medical evaluation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};