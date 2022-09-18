export interface Parser<Output, Args extends Array<unknown> = []> {
    parse(...args: Args): Output;
}
