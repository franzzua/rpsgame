import React, {MouseEventHandler, useMemo, useState} from "react";

export const Button = (props: {
    onClick(e: MouseEventHandler<HTMLButtonElement>): void | Promise<void | any>;
} & React.JSX.IntrinsicElements["button"]) =>  {
    const [loading, setLoading] = useState(false);
    const onClickInternal = useMemo<MouseEventHandler<HTMLButtonElement> | undefined>(() => props.onClick ? e => {
        const result = props.onClick(e) || null;
        if (!!result && (result instanceof Promise)) {
            setLoading(true)
            result.catch().then(() => setLoading(false));
        }
    } : undefined, [props.onClick])
    return <button {...props} disabled={loading || props.disabled} onClick={onClickInternal}>
        {loading ? <Loader/> : props.children}
    </button>
}


const Loader = () => <svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
    <circle cx="15" cy="15" r="15">
        <animate attributeName="r" from="15" to="15"
                 begin="0s" dur="0.8s"
                 values="15;9;15" calcMode="linear"
                 repeatCount="indefinite" />
        <animate attributeName="fill-opacity" from="1" to="1"
                 begin="0s" dur="0.8s"
                 values="1;.5;1" calcMode="linear"
                 repeatCount="indefinite" />
    </circle>
    <circle cx="60" cy="15" r="9" fill-opacity="0.3">
        <animate attributeName="r" from="9" to="9"
                 begin="0s" dur="0.8s"
                 values="9;15;9" calcMode="linear"
                 repeatCount="indefinite" />
        <animate attributeName="fill-opacity" from="0.5" to="0.5"
                 begin="0s" dur="0.8s"
                 values=".5;1;.5" calcMode="linear"
                 repeatCount="indefinite" />
    </circle>
    <circle cx="105" cy="15" r="15">
        <animate attributeName="r" from="15" to="15"
                 begin="0s" dur="0.8s"
                 values="15;9;15" calcMode="linear"
                 repeatCount="indefinite" />
        <animate attributeName="fill-opacity" from="1" to="1"
                 begin="0s" dur="0.8s"
                 values="1;.5;1" calcMode="linear"
                 repeatCount="indefinite" />
    </circle>
</svg>
