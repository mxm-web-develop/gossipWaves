'use client';

import React from 'react';

import { withRef } from '@udecode/cn';
import {
  useToggleToolbarButton,
  useToggleToolbarButtonState,
} from '@udecode/plate-toggle/react';
import { ListCollapseIcon } from 'lucide-react';

import { ToolbarButton } from './toolbar';

export const ToggleToolbarButton = withRef<typeof ToolbarButton>(
  (rest, ref) => {
    const state = useToggleToolbarButtonState();
    const { props } = useToggleToolbarButton(state);

    return (
      <ToolbarButton ref={ref} tooltip="折叠列表" {...props} {...rest}>
        <ListCollapseIcon />
      </ToolbarButton>
    );
  }
);
