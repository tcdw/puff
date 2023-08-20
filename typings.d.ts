import "umi/typings";

declare module "*.txt" {
    const content: string;
    export default content;
}
