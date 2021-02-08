
export type SimpleExpression = { type: "boolexpr" | "constexpr", binop?: string, attr?: string, constant: string };
/**
 * Lightweight parser for simple expressions with boolean constants (true/false)
 * and equality/inequality operators between attributes and constants, e.g., attr = const, attr != const
 */
export function simpleExpressionParser (expr: string | boolean): {
    res: SimpleExpression,
    err?: string
} {
    const ans = { res: null, err: null };
    if (typeof expr === "string") {
        if (expr.indexOf("!=") >= 0) {
            ans.res = expr.split("!=");
            ans.res = { type: "boolexpr", binop: "!=", attr: ans.res[0].trim(), constant: ans.res[1].trim() };
        } else if (expr.indexOf("=") >= 0) {
            ans.res = expr.split("=");
            ans.res = { type: "boolexpr", binop: "=", attr: ans.res[0].trim(), constant: ans.res[1].trim() };
        } else if (expr.toLowerCase() === "true") {
            ans.res = { type: "constexpr", constant: "true" };
        } else if (expr.toLowerCase() === "false") {
            ans.res = { type: "constexpr", constant: "false" };
        }
    } else {
        // boolean expression
        ans.res = { type: "constexpr", constant: `${expr}` };
    } 
    return ans;
}

export function resolveAttribute (state: string | {}, property: string): string {
    const pChain = property.split(".");
    let obj = state;
    let key: string = "";

    for (let i = 0; i < pChain.length && obj; i++) {
        key = pChain[i];
        obj = obj[key];
    }
    return (obj) ? (typeof obj === "string") ? obj : JSON.stringify(obj) : "";
}

/**
 * Evaluates the number contained in the string passed as argument.
 * If the value is in the form a/b, where a and b are numbers, then the funtion performs the division and returns a string representing the evaluated real value.
 * Otherwise the string is simply trimmed to remove initial and trailing white spaces.
*/
export function evaluate(str: string | number): string {
    if (str !== null && str !== undefined) {
        if (typeof str === "string") {
            str = str.trim();
            const args: string[] = str.split("/");
            if (args.length === 2 && !isNaN(+args[0]) && !isNaN(+args[1])) {
                return (+args[0] / +args[1]).toString();
            }
            return str;
        }
        return str.toString().trim();
    }
    return "";
}
