export interface ForceTellerSajuResponse {
  status: number;
  data: {
    bitmap: number;
    _기본명식: {
      _세차: Pillar;
      _월건: Pillar;
      _일진: Pillar;
      _시진: Pillar;
    };
    [key: string]: any;
  };
}

export interface Pillar {
  _천간: Element;
  _지지: Element;
  _지장간: Element[];
  _운성: {
    id: number;
    name: string;
    chinese: string;
  };
}

export interface Element {
  id: number;
  name: string;
  chinese: string;
  _음양?: {
    id: number;
    name: string;
    chinese: string;
  };
  _오행?: {
    id: number;
    name: string;
    chinese: string;
  };
  _십성?: {
    id: number;
    name: string;
    chinese: string;
  };
}

export interface FourPillarsResult {
  year: string;
  month: string;
  day: string;
  hour: string;
}
