import * as Colors from './colors';


// --------------------------- BUTTON SIZES -------------------------------

export const buttonSidebarSize = {
    height: 69,
    width: 211
}

export const buttonSidebarPLSize = {
    width: 159,
    height: 49
}

export const buttonSize = {
    width: 133,
    height: 47
}

export const buttonSizeMainMenuPL = {
    width: 110,
    height: 47
}

export const selectDeviceButtonSize = {
    width: 151,
    height: 48
}

export const deviceCardButtonSize = {
    height: 48,
    width: 106
}

export const deviceCardSmallButtonSize = {
    height: 30,
    width: 95
}

export const consoleButtonSize = {
    height: 30,
    width: 100
}

export const consoleTickButtonSize = {
    height: 30,
    width: 120
}

export const filterButtonSize = {
    height: 48,
    width: 200
}

export const deviceLayerButtonSize = {
    width: 68,
    height: 68
}

// --------------------------- BUTTON CSS -------------------------------

export const basicButtonCSS = {
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
    'padding': '10px 20px'
}

export const buttonSidebarCSS = {
    ...basicButtonCSS, ...{
        'border': '2px solid var(--White, #FEFFFF)',
        'color': Colors.white,
        background: Colors.mountain_meadow
    }
}


export const selectDeviceButtonCSS = {
    ...basicButtonCSS, ...{
        'border': '2px solid var(--White, #FEFFFF)',
        'color': Colors.white,
        background: Colors.mine_shaft2,
        'font-size': '12px',
    }
}


export const buttonCSS = {
    ...basicButtonCSS, ...{
        'border': '2px solid var(--lightest, #6CFFAF)',
        'background': Colors.aquamarine,
        'color': Colors.mine_shaft,
    }
}


export const consoleButtonCSS = {
    ...basicButtonCSS, ...{
        'color': Colors.mine_shaft,
        background: Colors.yellow,
        cursor: 'pointer',
        'border': '2px solid var(--lightest, #6CFFAF)',
        'z-index': 3,
    }
}



export const filterButtonCSS = {
    ...basicButtonCSS, ...{
        'border': '2px solid var(--lightest, #6CFFAF)',
        'background': Colors.aquamarine,
        'color': Colors.mine_shaft,
        'font-size': '18px'
    }
}

export const deviceSmallButtonCSS = {
    ...basicButtonCSS, ...{
        'border': '2px solid var(--Blue, #336CFB)',
        'background': Colors.blue,
        'color': Colors.white,
        'font-size': '12px'
    }
}

export const deviceButtonCSS = {
    ...basicButtonCSS, ...{
        'border': '2px solid var(--Blue, #336CFB)',
        'background': Colors.blue,
        'color': Colors.white,
        'font-size': '14px'
    }
}

// --------------------------- DISPLAY CSS -------------------------------

export const basicDisplayCSS = {
    background: 'transparent',
    'color': Colors.white,
    'font-family': 'Lato',
    'font-weight': '700',
    'font-style': 'normal',
    'font-size': '16px',
    'line-height': '24px',
    'letter-spacing': '0.1px'
}

export const vsScreenValueCSS = {
    ...basicDisplayCSS, ...{
        'color': Colors.mountain_meadow,
        'font-weight': '400',
        'font-size': '40px',
        'display': 'flex',
        'align-items': 'center',
    }
}

export const vsScreenLabelCSS = {
    ...basicDisplayCSS, ...{
        'font-weight': '400',
        'font-size': '40px',
        'display': 'flex',
        'align-items': 'center',
    }
}

export const vsSideScreenValueCSS = {
    'font-family': 'Lato',
    'font-style': 'normal',
    'font-weight': '400',
    'font-size': '40px',
    'line-height': '24px',
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'letter-spacing': '0.1px',
    'color': Colors.mountain_meadow,
    'height': '86px',
    'width': '309px',
}

export const vsSideScreenLabelCSS = {
    'font-family': 'Lato',
    'padding-left': '15px',
    'font-style': 'normal',
    'font-weight': '400',
    'font-size': '50px',
    'line-height': '24px',
    'display': 'flex',
    'align-items': 'center',
    'letter-spacing': '0.1px',
    'color': Colors.white,
    'height': '86px',
    'width': '309px',
}
export const ipDisplayCSS = {
    ...basicDisplayCSS, ...{
        'font-weight': '400',
        'font-size': '14px',
        'display': 'flex',
        'align-items': 'center',
    }
}

export const deviceCardTitleCSS = {
    ...basicDisplayCSS, ...{
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
    }
}

export const deviceCardDisplayCSS = {
    ...basicDisplayCSS, ...{
        'font-weight': '400',
        'font-size': '12px',
        'display': 'flex',
        'align-items': 'center',
        'color': Colors.mountain_meadow
    }
}

export const deviceCardLabelCSS = {
    ...basicDisplayCSS, ...{
        'font-weight': '400',
        'font-size': '12px',
        'display': 'flex',
        'align-items': 'center'
    }
}

export const coordPatientNameDisplayCSS = {
    ...basicDisplayCSS, ...{
        'color': Colors.mountain_meadow,
        'font-size': '20px',
        'text-align': 'center',
        'padding': '22px 0px'
    }
}

export const numFormValidatorCSS = {
    ...basicDisplayCSS, ...{
        'color': Colors.red,
        'font-size': '12px',
        'text-align': 'left'
    }
}

export const editInfoDisplayCSS = {
    ...basicDisplayCSS, ...{
        'font-size': '12px',
        'display': 'flex',
        'color': Colors.white,
        'justify-content': 'start'
    }
}

export const entryCSS = {
    'display': 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center',
    'flex-shrink': '0',
    'font-weight': '400'
}

export const leftDisplayCSS = { ...basicDisplayCSS, ...{ 'text-align': 'left' } }

export const rightDisplayCSS = { ...basicDisplayCSS, ...{ 'text-align': 'right' } }

export const entryDisplayCSS = {}

export const titleDisplayCSS = {
    ...basicDisplayCSS, ...{
        'font-size': '25px',
        'line-height': '70px',
        'letter-spacing': '0.4px',
        'text-align': 'center'
    }
}

export const greenTitleDisplayCSS = {
    ...basicDisplayCSS, ...{
        'color': Colors.mountain_meadow,
        'font-size': '20px',
        'line-height': '24px', /* 150% */
        padding: '9px 0px',
        'text-align': 'center'
    }
}

export const smallDisplayCSS = {
    ...basicDisplayCSS, ...{
        'font-size': '12px',
        'display': 'flex',
        'justify-content': 'start',
        'align-items': 'baseline'
    }
}

// --------------------------- Widget CSS -------------------------------

export const greenBorder = {
    'border-radius': '10px',
    'border': '3px solid #6CFFAF',
    background: Colors.mine_shaft2,
}

export const constraintTextCSS = {
    'position': 'relative',
    'text-align': 'center',
    'vertical-align': 'middle',
    'display': 'table-cell',
    'color': Colors.lightblue,
    'font-size': '16px',
    'font-family': 'Lato',
    'font-weight': '400',
    'line-height': '24px',
    'letter-spacing': '0.10px'
}

export const ruleTextCSS = {
    ...constraintTextCSS, ...{
        'width': '788px',
        'height': '56px',
        'top': '27px',
        'left': '9px'
    }
}

// --------------------------- FORM CSS -------------------------------

export const formInputSize = {
    height: 86,
    width: 221
}

export const formHeaderCSS = {
    'display': 'flex',
    'width': '221px',
    'height': '43px',
    'flex-direction': 'column',
    'justify-content': 'center',
    'flex-shrink': '0',
    'color': 'var(--lightest, #6CFFAF)',
    'font-family': 'Lato',
    'font-size': '16px',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': '24px', /* 150% */
    'letter-spacing': '0.1px'
}

export const formInputCSS = {
    'padding-left': '42px',
    'width': '221px',
    'height': '40px',
    'border-radius': '100px',
    'background': 'var(--Neutral-White, #FFF)',
    'color': 'var(--Neutral-Gray, #A0A4A8)',
    'font-family': 'Lato',
    'font-size': '13px',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '16px', /* 150% */
    'letter-spacing': '0.1px'
}

export const formActionInputSize = {
    height: 86,
    width: 350
}

export const formActionHeaderCSS = {
    'display': 'flex',
    'width': '251px',
    'height': '43px',
    'flex-direction': 'column',
    'justify-content': 'center',
    'flex-shrink': '0',
    'color': 'var(--lightest, #6CFFAF)',
    'font-family': 'Lato',
    'font-size': '16px',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': '24px', /* 150% */
    'letter-spacing': '0.1px'
}

export const formActionInputCSS = {
    'padding-left': '42px',
    'width': '350px',
    'height': '40px',
    'border-radius': '100px',
    'background': 'var(--Neutral-White, #FFF)',
    'color': 'var(--Neutral-Gray, #A0A4A8)',
    'font-family': 'Lato',
    'font-size': '13px',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '16px', /* 150% */
    'letter-spacing': '0.1px'
}

export const formHeaderInputPairCSS = {
    'display': 'flex',
    'gap': '3px',
    'flex-direction': 'column'
}

export const consoleFormInputSize = {
    height: 30,
    width: 116
}

export const consoleFormInputCSS = {
    'padding-left': '35px',
    'border-radius': '100px',
    'background': 'var(--Neutral-White, #FFF)',
    'color': 'var(--Neutral-Gray, #A0A4A8)',
    /* Subtitle 1 - bold 16 (24, 0.1px) */
    'font-family': 'Lato',
    'font-size': '13px',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '16px', /* 150% */
    'letter-spacing': '0.1px'
}

// ------------------------------------------------------------------------

// Good ideia backgorund transparente and overflow hidden
