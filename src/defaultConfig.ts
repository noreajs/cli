import INoreaConfig from "./interfaces/INoreaConfig";

const defaultConfig: INoreaConfig = {
  template: "typescript",
  dbStrategy: "mongoose",
  rootDir: "src",
  folders: {
    controllers: "controllers",
    interfaces: "interfaces",
    middlewares: "middlewares",
    models: "models",
    providers: "providers",
    routes: "routes",
  },
};

export default defaultConfig;
