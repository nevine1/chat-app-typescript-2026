import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { }
export interface IAppProps {
}

export default function Messages(props: IAppProps) {
    const dispatch = useDispatch();
    const messages = useSelector((state: any) => state.messages.messages);
    return (
        <div>

        </div>
    );
}
