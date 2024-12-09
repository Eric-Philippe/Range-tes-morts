export interface GuideStep {
  title: string;
  illustrations: string[];
  steps: string[];
}

export interface Guide {
  title: string;
  description: string;
  steps: GuideStep[];
}
