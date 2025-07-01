import React, { useState } from 'react';
import { Microscope, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/FileUpload';
import { MediaPreview } from '@/components/MediaPreview';
import { AnalysisResults } from '@/components/AnalysisResults';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  sperm_count: number;
  confidence?: number;
  analysis_time?: number;
  image_quality?: 'excellent' | 'good' | 'fair' | 'poor';
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const simulateAnalysis = async (file: File): Promise<AnalysisResult> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    
    // Simulate realistic results based on file type
    const baseCount = Math.floor(Math.random() * 200) + 10;
    const confidence = 85 + Math.random() * 10;
    const analysis_time = 2.5 + Math.random() * 2;
    const qualities = ['excellent', 'good', 'fair', 'poor'] as const;
    const image_quality = qualities[Math.floor(Math.random() * qualities.length)];
    
    return {
      sperm_count: baseCount,
      confidence: Math.round(confidence),
      analysis_time: Number(analysis_time.toFixed(1)),
      image_quality
    };
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a video or image file to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await simulateAnalysis(selectedFile);
      setAnalysisResult(result);
      toast({
        title: "Analysis complete",
        description: `Detected ${result.sperm_count} sperm cells with ${result.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Microscope className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SpermVision AI</h1>
              <p className="text-muted-foreground">Advanced sperm analysis powered by computer vision</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <Brain className="w-10 h-10 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">AI-Powered Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced YOLOv8 computer vision model for accurate sperm cell detection and counting
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="w-10 h-10 text-accent mx-auto mb-2" />
              <CardTitle className="text-lg">Real-time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Fast processing of video and image files with immediate results and confidence scores
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Microscope className="w-10 h-10 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Clinical Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Professional-grade analysis tools designed for research and medical applications
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Analysis Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              isProcessing={isAnalyzing}
            />
            
            {selectedFile && (
              <div className="flex justify-center">
                <Button
                  variant="medical"
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-8"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    'Start Analysis'
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <MediaPreview file={selectedFile} isAnalyzing={isAnalyzing} />
            <AnalysisResults result={analysisResult} isAnalyzing={isAnalyzing} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            This application uses artificial intelligence for research purposes only. 
            Results should not replace professional medical evaluation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
