
// --------------------------- BUTTON Properties -------------------------------

import * as Colors from "./colors"

export const buttonSize = {
    height: 55,
    width: 133
}

export const buttonCSS = {
    'display': 'flex',
    'padding': '10px 20px',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center',
    'flex-shrink': 0,
    'border-radius': '4px',
    'border': '2px solid var(--mine-shaft-darker, #303030)',
    'background': Colors.mountain_meadow,
    'color': Colors.white,
    'text-align': 'center',

    /* Button - bold 14 (18, 0.2px) */
    'font-family': 'Lato',
    'font-size': '18px',
    'font-style': 'normal',
    'font-weight': '800',
    'line-height': '18px', /* 128.571% */
    'letter-spacing': '0.2px'
}

export const medicinesButtonSize = {
    height: 200,
    width: 200
}

export const medicinesButtonCSS = {
    'display': 'flex',
    'padding': '10px 20px',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center',
    'flex-shrink': 0,
    'border-radius': '4px',
    'border': '2px solid var(--mine-shaft-darker, #303030)',
    'background': Colors.dark_green,
    'color': Colors.white,
    'text-align': 'center',

    /* Button - bold 14 (18, 0.2px) */
    'font-family': 'Lato',
    'font-size': '30px',
    'font-style': 'normal',
    'font-weight': '800',
    'line-height': '18px', /* 128.571% */
    'letter-spacing': '0.2px'
}

export const listButtonSize = {
    height: 70,
    width: 574
}

export const listButtonCSS = {
    'background': Colors.mine_shaft2,
    'color': Colors.white,

    /* Button - bold 14 (18, 0.2px) */
    'text-align': 'left',
    'font-family': 'Lato',
    'font-size': '32px',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': '70px', /* 128.571% */
    'letter-spacing': '0.4px'
}

export const scrollButtonSize = {
    height: 40,
    width: 40
}

export const scrollButtonCSS = {
    'display': 'flex',
    'padding': '10px 20px',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center',
    'flex-shrink': '0',

    // 'gap': '8px',
    // 'flex': '1 0 0',
    // 'align-self': 'stretch',
    'border-radius': '0px 0px 4px 4px',
    'background': Colors.blue,


    'color': Colors.white,
    'text-align': 'center',
    'font-family': 'Lato',
    'font-size': '18px',
    'font-style': 'normal',
    'font-weight': '800',
    'line-height': '18px', /* 100% */
    'letter-spacing': '0.2px'
}

// --------------------------- Password Input Properties -------------------------------

export const passwordInputSize = {
    height: 40,
    width: 381
}

export const passwordInputCSS = {
    'border-radius': '100px',
    'background': Colors.white,

    'display': 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
    'flex-shrink': '0',

    'color': 'var(--Neutral-Gray, #A0A4A8)',
    'text-align': 'center',
    'font-family': 'Lato',
    'font-size': '18px',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '16px', /* 88.889% */
    'letter-spacing': '0.1px',
}

// --------------------------- Multi Display Properties -------------------------------

export const displaySize = {
    height: 50,
    width: 574
}

export const displayCSS = {
    'display': 'flex',
    'flex-direction': 'row',
    'justify-content': 'start',

    'color': Colors.white,
    'background': Colors.mine_shaft2,
    'text-align': 'left',
    'font-family': 'Lato',
    'font-size': '26px',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': '70px', /* 88.889% */
    'letter-spacing': '0.4px',
}

// --------------------------- Form Properties -------------------------------

export const inputSize = {
    height: 50,
    width: 614
}

export const inputLabelCss = {
    'width': '216px',
    'height': '50px',
    'display': 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
    'flex-shrink': '0',
    'color': Colors.white,
    'font-family': 'Lato',
    'font-size': '26px',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': '70px', /* 269.231% */
    'letter-spacing': '0.4px',
}

export const inputCSS = {
    'width': '398px',
    'height': '40px',
    'flex-shrink': '0',
    'border-radius': '100px',
    'background': Colors.white,

    'color': 'var(--Neutral-Gray, #A0A4A8)',
    'text-align': 'center',
    'font-family': 'Lato',
    'font-size': '18px',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '16px', /* 88.889% */
    'letter-spacing': '0.1px',
}

export const inputLabelDivCss = {
    'display': 'flex',
    'align-items': 'center'
}

// --------------------------- Console Properties -------------------------------

export const consoleButtonSize = {
    height: 30,
    width: 140
}

export const consoleButtonCSS = {
    'display': 'flex',
    'font-weight': '700',
    'flex-direction': 'column',
    'flex-shrink': '0',
    'border-radius': '4px',
    'font-size': '14px',
    'font-family': 'Lato',
    'font-style': 'normal',
    'align-items': 'center',
    'justify-content': 'center',
    'text-align': 'center',
    'line-height': '18px',
    'letter-spacing': '0.2px',
    'padding': '10px 20px',
    'color': Colors.mine_shaft,
    background: Colors.yellow,
    cursor: 'pointer',
    'border': '2px solid var(--lightest, #6CFFAF)',
    'z-index': 3,
}

export const consoleDisplay = {
    'color': Colors.white,
    'text-align': 'center',
    /* Subtitle 1 - bold 16 (24, 0.1px) */
    'font-family': 'Lato',
    'font-size': '16px',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': '24px', /* 150% */
    'letter-spacing': '0.1px',
    'background': Colors.mine_shaft2
}
