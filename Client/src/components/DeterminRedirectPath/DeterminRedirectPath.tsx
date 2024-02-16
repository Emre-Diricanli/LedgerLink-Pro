export function redirectBasedOnValue(value: number): string {
    let redirectUrl: string;

    switch (value) {
        case 1:
            redirectUrl = "/user-sigin";
            break;
        case 2:
            redirectUrl = "/user-sigin";
            break;
        case 3:
            redirectUrl = "/admin-sigin";
            break;
        default:
            redirectUrl = "/user-sigin";
            break;
    }

    return redirectUrl;
}