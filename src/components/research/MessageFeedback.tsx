import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ThumbsUp, ThumbsDown, MessageSquare, Send, X, CheckCircle } from "lucide-react";
import { saveFeedback, getFeedbackForMessage, type MessageFeedback } from "./feedback-utils";

interface MessageFeedbackProps {
  messageId: string;
  researchArea?: string;
  companyName?: string;
  userRole?: string;
  className?: string;
}

export default function MessageFeedback({ 
  messageId, 
  researchArea, 
  companyName, 
  userRole,
  className = "" 
}: MessageFeedbackProps) {
  const [currentFeedback, setCurrentFeedback] = useState<MessageFeedback | null>(null);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [detailedFeedback, setDetailedFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const existingFeedback = getFeedbackForMessage(messageId);
    setCurrentFeedback(existingFeedback);
    if (existingFeedback?.detailedFeedback) {
      setDetailedFeedback(existingFeedback.detailedFeedback);
    }
  }, [messageId]);

  const handleRatingClick = async (rating: 'positive' | 'negative') => {
    const feedback: MessageFeedback = {
      messageId,
      rating,
      timestamp: new Date(),
      researchArea,
      companyName,
      userRole,
      detailedFeedback: currentFeedback?.detailedFeedback
    };

    saveFeedback(feedback);
    setCurrentFeedback(feedback);
    
    // Show thank you animation
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 2000);
  };

  const handleDetailedSubmit = async () => {
    if (!detailedFeedback.trim()) return;
    
    setIsSubmitting(true);
    
    const feedback: MessageFeedback = {
      messageId,
      rating: currentFeedback?.rating || null,
      detailedFeedback: detailedFeedback.trim(),
      timestamp: new Date(),
      researchArea,
      companyName,
      userRole
    };

    saveFeedback(feedback);
    setCurrentFeedback(feedback);
    setShowDetailedForm(false);
    setIsSubmitting(false);
    
    // Show thank you animation
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 2000);
  };

  const handleDetailedFormToggle = () => {
    setShowDetailedForm(!showDetailedForm);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Quick Rating Buttons */}
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <span className="text-xs text-muted-foreground">Was this helpful?</span>
        
        <div className="flex items-center gap-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={currentFeedback?.rating === 'positive' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleRatingClick('positive')}
              className="h-8 px-2"
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={currentFeedback?.rating === 'negative' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleRatingClick('negative')}
              className="h-8 px-2"
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>
          </motion.div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDetailedFormToggle}
          className="h-8 px-2 text-xs"
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Feedback
        </Button>
      </motion.div>

      {/* Thank You Animation */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="flex items-center gap-2 text-green-600 text-xs"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Thank you for your feedback!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Feedback Status */}
      {currentFeedback && !showThankYou && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-2"
        >
          <Badge variant="secondary" className="text-xs">
            {currentFeedback.rating === 'positive' ? (
              <>
                <ThumbsUp className="w-3 h-3 mr-1" />
                Helpful
              </>
            ) : currentFeedback.rating === 'negative' ? (
              <>
                <ThumbsDown className="w-3 h-3 mr-1" />
                Not Helpful
              </>
            ) : null}
          </Badge>
          
          {currentFeedback.detailedFeedback && (
            <Badge variant="outline" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Detailed feedback provided
            </Badge>
          )}
        </motion.div>
      )}

      {/* Detailed Feedback Form */}
      <AnimatePresence>
        {showDetailedForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="border border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Provide detailed feedback</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetailedForm(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                <Textarea
                  value={detailedFeedback}
                  onChange={(e) => setDetailedFeedback(e.target.value)}
                  placeholder="Help us improve by sharing specific feedback about this response..."
                  className="min-h-[80px] text-sm resize-none"
                  maxLength={500}
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {detailedFeedback.length}/500 characters
                  </span>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="sm"
                      onClick={handleDetailedSubmit}
                      disabled={!detailedFeedback.trim() || isSubmitting}
                      className="h-8"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 mr-1" />
                          Send Feedback
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}