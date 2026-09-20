// src\helper.ts
import os from "node:os";
import path from "node:path";
import * as fs from "node:fs";
import * as fs2 from "node:fs/promises";
import * as prompts from "@clack/prompts";

// 입력 판단 함수
// true 면 입력 성공
type FUNC_INPUT_CHECK = (v: string) => true | string;

export const Base = {
  os,
  fs,
  fs2,
  path,
  //   crypto,
  //   readline,
  //   stream,
};

// 콘솔 프로그램이다.
// prompt 를 사용한다.
let use_prompts = false;
export function use_console() {
  use_prompts = true;
}

// 콘솔 환경이 아니면 막아버린다.
export function check_use_console() {
  if (use_prompts) return;
  throw new Error("use_prompts stop");
}

// 입력 받기
export async function console_input(
  //
  message: string,
  func: FUNC_INPUT_CHECK
) {
  check_use_console();

  const input = await prompts.text({
    message,
    // initialValue: "Guest", // 아무것도 입력하지 않았을 때의 기본값
    validate(val) {
      var s = "";
      if (val === undefined) {
        //
      } else {
        s = val;
      }

      // 탈출 불가능한 상황이 일경우 특별히 입력
      if (s == "exit(1)") {
        console.info("console_input exit(1)");
        process.exit(1);
      }

      // 무조건 나가기
      if (s == "exit") {
        console.info("console_input exit");
        return undefined;
      }

      var ret = func(s);
      if (ret === true) {
        return undefined;
      }

      return ret;
    },
  });
  return input as string;
}
