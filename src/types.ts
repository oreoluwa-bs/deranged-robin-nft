export interface Prediction {
  completed_at: string;
  created_at: string;
  error?: any;
  id: string;
  input: { prompt: string; image_dimensions: string };
  logs: string;
  metrics: { predict_time: number };
  output: string[];
  started_at: string;
  status: string;
  urls: {
    get: string;
    cancel: string;
  };
  version: string;
  webhook_completed?: any;
}
