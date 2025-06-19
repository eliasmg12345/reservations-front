import { Slide, Zoom } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, ReactElement, Ref } from "react";


export const TransitionSlide = forwardRef(function Transition(
    props: TransitionProps & { children: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return (
        <Slide direction={'up'} ref={ref} {...props}>
            {props.children}
        </Slide>
    )
})

export const TransitionZoon = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>
    },
    ref: Ref<unknown>
) {
    return (
        <Zoom ref={ref} {...props}>
            {props.children}
        </Zoom>
    )
})