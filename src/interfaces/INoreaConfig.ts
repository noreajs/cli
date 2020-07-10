export default interface INoreaConfig {
  template: "typescript" | "javascript";
  dbStrategy: "mongoose" | "sequelize";
  rootDir: string;
  folders: {
    controllers: string;
    routes: string;
    middlewares: string;
    providers: string;
    models: string;
    interfaces: string;
  };
}
