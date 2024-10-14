declare module 'openapi-types' {
    export namespace OpenAPIV3 {
        export interface Document {
            openapi: string;
            info: InfoObject;
            servers?: ServerObject[];
            paths?: PathsObject;
        }

        export interface InfoObject {
            title: string;
            version: string;
            description?: string;
        }

        export interface ServerObject {
            url: string;
        }

        export interface PathsObject {
            [path: string]: PathItemObject;
        }

        export interface PathItemObject {
            get?: OperationObject;
            post?: OperationObject;
            // add other HTTP methods as needed
        }

        export interface OperationObject {
            summary?: string;
            responses: ResponsesObject;
        }

        export interface ResponsesObject {
            [status: string]: ResponseObject;
        }

        export interface ResponseObject {
            description: string;
        }
    }
}
