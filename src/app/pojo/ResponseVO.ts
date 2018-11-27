import {MetaVO} from './MetaVO';

export class ResponseVO {
  code: number;
  msg: string;
  data: any;
  meta: MetaVO;
}
