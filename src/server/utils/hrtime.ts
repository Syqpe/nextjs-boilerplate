type Seconds = number;
type RemainedNanoseconds = number;

const NS_PER_SEC = 1e9;
const NS_PER_ML = 1e6;

export function hrtimeHumanize(hrtime: [Seconds, RemainedNanoseconds]) {
    const [hrtimeSeconds, hrtimeNanoseconds] = hrtime;
    const nanoseconds = hrtimeSeconds * NS_PER_SEC + hrtimeNanoseconds;
    const milliseconds = nanoseconds / NS_PER_ML;
    const seconds = nanoseconds / NS_PER_SEC;

    return {
        seconds,
        milliseconds,
        nanoseconds,
    };
}
