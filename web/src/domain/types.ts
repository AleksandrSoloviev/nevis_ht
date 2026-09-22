export type MonthlyValues = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export type Channel = {
  id: string;
  name: string;
  values: number[];
};

export type Employee = {
  id: string;
  name: string;
  values: number[];
  channels?: Channel[];
};

export type Branch = {
  id: string;
  name: string;
  values: number[];
  employees?: Employee[];
};

export type Company = {
  id: string;
  name: string;
  values: number[];
  branches?: Branch[];
};

export type TreeNode = Company | Branch | Employee | Channel;

export type NodeKind = "company" | "branch" | "employee" | "channel";
