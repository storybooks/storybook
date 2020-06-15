export interface Argument {
  name: string;
  type: string;
  optional?: boolean;
}

export interface Decorator {
  name: string;
  stringifiedArguments: string;
}

export interface Method {
  name: string;
  args: Argument[];
  returnType: string;
  optional: boolean;
  modifierKind?: number[];
  decorators?: Decorator[];
  description?: string;
}

export interface Property {
  name: string;
  defaultValue?: string;
  type: string;
  optional: boolean;
  description?: string;
  decorators?: Decorator[];
  modifierKind?: number[];
}

export interface Class {
  name: string;
  ngname: string;
  type: 'pipe';
  properties: Property[];
  methods: Method[];
  description?: string;
  rawdescription?: string;
}

export interface Injectable {
  name: string;
  type: 'injectable';
  properties: Property[];
  methods: Method[];
  description?: string;
  rawdescription?: string;
}

export interface Pipe {
  name: string;
  type: 'class';
  properties: Property[];
  methods: Method[];
  description?: string;
  rawdescription?: string;
}

export interface Directive {
  name: string;
  type: 'directive' | 'component';
  propertiesClass: Property[];
  inputsClass: Property[];
  outputsClass: Property[];
  methodsClass: Method[];
  description?: string;
  rawdescription?: string;
}

export type Component = Directive;

export interface CompodocJson {
  directives: Directive[];
  components: Component[];
  pipes: Pipe[];
  injectables: Injectable[];
  classes: Class[];
}
