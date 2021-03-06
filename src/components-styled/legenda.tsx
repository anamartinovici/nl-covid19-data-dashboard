import css from '@styled-system/css';
import * as React from 'react';
import styled from 'styled-components';

type Shape = 'line' | 'square';

interface LegendProps {
  items: Array<{ color: string; label: string; shape: Shape }>;
}

export function Legenda({ items }: LegendProps) {
  return (
    <List>
      {items.map(({ label, color, shape = 'line' }, i) => (
        <Item key={i}>
          {label}
          {shape === 'square' && <Square color={color} />}
          {shape === 'line' && <Line color={color} />}
        </Item>
      ))}
    </List>
  );
}

const List = styled.ul(
  css({
    listStyle: 'none',
    pl: 4,
  })
);

const Item = styled.li(
  css({
    my: 3,
    position: 'relative',
  })
);

const Shape = styled.div<{ color: string }>((x) =>
  css({
    content: '',
    display: 'block',
    position: 'absolute',
    left: '-25px',

    backgroundColor: x.color,
  })
);

const Line = styled(Shape)(
  css({
    top: '10px',
    width: '15px',
    height: '3px',
  })
);

const Square = styled(Shape)(
  css({
    top: '5px',
    width: '15px',
    height: '15px',
  })
);
