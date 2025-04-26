import { STATUS_ERROR, STATUS_FATAL, STATUS_OK } from "./constants";
import { RespType } from "./types";

export default function formatResp(status: string, message: any): RespType {
    return { status, message };
}

export function okResp(message: any): RespType {
    return formatResp(STATUS_OK, message);
}

export function errorResp(message: any): RespType {
    return formatResp(STATUS_ERROR, message);
}

export function fatalResp(message: any): RespType {
    return formatResp(STATUS_FATAL, message);
}