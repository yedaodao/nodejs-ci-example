export async function echo(ctx, next) {
    ctx.body = {
        message: 'Hello world'
    };
}
