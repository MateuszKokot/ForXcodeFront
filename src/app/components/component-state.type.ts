export type HTTPError = {status: number; message: string};

// idle
type IdleState = {
    state: "idle";
}
// loading
type LoadingState = {
    state: "loading";
}
// success
type SuccessState<T> = {
    state: "success";
    result: T[];
}
// error
type ErrorState = {
    state: "error";
}

export type ComponentState<t> = IdleState | LoadingState | SuccessState<t> | ErrorState; 
