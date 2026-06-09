import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { ParsedText } from './src/components/ParsedText';

const text = "합을 구성하는 글자들이 멀리 떨어져서(년지의 [var(--color-wood):사(巳)] + 시지의 [var(--color-fire):오(午)]) 성립하는 원격 합입니다.";
const html = renderToStaticMarkup(React.createElement(ParsedText, { text, lang: "KO" }));
console.log(html);
