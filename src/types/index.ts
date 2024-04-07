import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Room = {
  offer?: {
    type: string;
    sdp?: string;
  };
  answer?: {
    type: string;
    sdp?: string;
  };
};

export type Host = {
  [field: string]: any;
};

export type Guest = {
  [field: string]: any;
};
