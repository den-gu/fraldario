// types.d.ts
declare module 'formidable' {
    import { IncomingMessage } from 'http';
    import { ParsedUrlQuery } from 'querystring';
  
    type File = {
      size: number;
      filepath: string;
      originalFilename: string;
      mimetype: string;
    };
  
    type Fields = { [key: string]: string | string[] };
    type Files = { [key: string]: File | File[] };
  
    export interface IncomingForm {
      parse(req: IncomingMessage, callback: (err: Error | null, fields: Fields, files: Files) => void): void;
    }
  
    const IncomingForm: new () => IncomingForm;
    export default IncomingForm;
  }
  