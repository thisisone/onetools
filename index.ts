// index_magnet.ts

import WebTorrent, * as TORR from "webtorrent";
import * as Helper from "./src/helper";

//
interface MENU_DATA {
  cmd: string;
  func: (args: string[]) => Promise<void>;
}

//
const path = Helper.Base.path;
const client = new WebTorrent();

const list_torr: TORR.Torrent[] = [];

const menus: MENU_DATA[] = [
  {
    cmd: "add",
    func: async (argv) => {
      const dir = path.join("downloads");
      const magnet_url = argv[1];
      console.log("add try", magnet_url);
      client.add(magnet_url, { path: dir }, (torrent) => {
        console.log("add ok");
        list_torr.push(torrent);
      });
    },
  },
  {
    cmd: "list",
    func: async () => {
      console.log("list_torr", list_torr.length);

      for (const torrent of list_torr) {
        console.log("item", torrent.name);

        const progress = (torrent.progress * 100).toFixed(1);
        const speed = (torrent.downloadSpeed / 1024 / 1024).toFixed(2);
        const peers = torrent.numPeers;

        console.log(
          `- 진행률: ${progress}% | 속도: ${speed} MB/s | 피어 수: ${peers}개`
        );
      }
    },
  },
];
async function main() {
  console.log("main start");
  Helper.use_console();

  try {
    while (true) {
      const input = await Helper.console_input("cmd ?", (val) => {
        if (val == "exit") return true;
        // return "unknown cmd";
        return true;
      });

      // console.log("input", input);
      if (input == "exit") {
        break;
      }

      const argv = input.split(" ");
      const cmd = argv[0];

      let found = false;
      for (const menu of menus) {
        if (menu.cmd != cmd) continue;

        console.log("cmd start", argv);
        await menu.func(argv);
        found = true;
        break;
      }

      if (found) continue;

      console.log("unknown cmd", argv);
    }
  } finally {
    console.log("main end");
    process.exit(0);
  }
}
main();
