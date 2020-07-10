export declare type ConfigTemplateType = "typescript" | "javascript";
export declare type ConfigDBStrategyType = "mongoose" | "sequelize";
export declare type ConfigFoldersType = {
  controllers: string;
  routes: string;
  middlewares: string;
  providers: string;
  models: string;
  interfaces: string;
};

export interface INoreaConfig {
  template: ConfigTemplateType;
  dbStrategy: ConfigDBStrategyType;
  rootDir: string;
  folders: ConfigFoldersType;
}

export interface INoreaConfigUpdate {
  template?: ConfigTemplateType;
  dbStrategy?: ConfigDBStrategyType;
  rootDir?: string;
  folders?: Partial<ConfigFoldersType>;
}
