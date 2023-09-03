
export default abstract class Session<T> {
    public additionParams: any = {}
    public abstract makeSDParam(): T;
}