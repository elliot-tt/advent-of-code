import {readLines} from "./util/readFile";
import {hideBin} from "yargs/helpers";
import yargs from "yargs";
import {PathLike} from "node:fs";
import {read} from "fs";

const argv = yargs(hideBin(process.argv))
    .command('sum-calibration <input>', "Sums the two digit numbers made by the first and last digit of each line")
    .positional('input', {
        type: 'string'
    })
    .demandCommand()
    .parseSync();

const command = argv._[0];

switch (command) {
    case 'sum-calibration':
        sumCalibration(argv.input as string);
        break;
    default:
        throw new Error(`Yargs knows this one but I don't! ${command}`)
}

function sumCalibration(path: PathLike) {
    const lines = readLines(path);
    function twoDigit(line: string): number {
        const digitWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const digits = [];
        const chars = line.split("");
        let left = 0;
        let right = 1;
        while (right <= chars.length) {
            const substr = chars.slice(left, right).join("");
            // Special case for digits
            if (substr.length == 1) {
                const int = Number.parseInt(substr)
                if (Number.isInteger(int)) {
                    digits.push(int);
                    left = right;
                    continue;
                }
            }

            const candidate = digitWords.findIndex(w => w.startsWith(substr));
            if (candidate !== -1) {
                if (substr === digitWords[candidate]) {
                    digits.push(candidate+1);
                    left++;
                } else {
                    right++;
                }
            } else {
                left++;
            }

            if (left === right) {
                right++;
            }
        }

        console.log(JSON.stringify(digits));
        return Number.parseInt(`${digits.at(0)}${digits.at(-1)}`)
    }
    console.log(lines.map(twoDigit).reduce((a,b) => a+b, 0));
}

