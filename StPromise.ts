namespace StPromise{
    export interface IPromiseFunction{
        (resolve: Function, rejct: Function)
    }
    export interface Function{
        (data: any)
    }
}

export class StPromise{
    private state: "pending" | "done" | "error" =  "pending";
    constructor(promiseFunc: StPromise.IPromiseFunction) {
        let _this = this;
        promiseFunc(function (data: any) {
            _this.state = "done";
            _this.whenDone(data);
        }, (error) => {
            _this.state = "error";
            _this.whenFail(error);
        });
    }
    private whenDone(data) {};
    private whenFail(error) {};
    public done(func: StPromise.Function): this {
        this.whenDone = func;
        return this;
    }
    public fail(func:  StPromise.Function): this {
        this.whenFail = func;
        return this;
    }
    public catch(func:  StPromise.Function): this {
        this.fail(func);
        return this;
    }
    public then(func:  StPromise.Function): this {
        this.done(func);
        return this;
    }
    public getState() {
        return this.state;
    }
}