import { tags } from '@lezer/highlight'
import { HighlightStyle } from '@codemirror/language'

export const useHighlightStyle = () => {
    return HighlightStyle.define([
        {
            tag: tags.link,
            textDecoration: 'underline',
        },
        {
            tag: tags.heading,
            textDecoration: 'underline',
            fontWeight: 'bold',
        },
        {
            tag: tags.meta,
            color: '#2a719b',
        },
        {
            tag: tags.emphasis,
            fontStyle: 'italic',
        },
        {
            tag: tags.strong,
            fontWeight: 'bold',
        },
        {
            tag: tags.strikethrough,
            textDecoration: 'line-through',
        },
        {
            tag: tags.keyword,
            color: '#8e0b99',
        },
        {
            tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
            color: '#121cb1',
        },
        {
            tag: [tags.literal, tags.inserted],
            color: '#116644',
        },
        {
            tag: [tags.deleted],
            color: '#aa1111',
        },
        {
            tag: [tags.bracket],
            color: '#0d64d5',
        },
        {
            tag: [tags.string],
            color: '#08822c',
        },
        {
            tag: [tags.regexp, tags.escape, tags.special(tags.string)],
            color: '#ee4400',
        },
        {
            tag: tags.definition(tags.variableName),
            color: '#255fb9',
        },
        {
            tag: tags.local(tags.variableName),
            color: '#3300aa',
        },
        {
            tag: [tags.typeName, tags.namespace],
            color: '#b7382b',
        },
        {
            tag: tags.className,
            color: '#116677',
        },
        {
            tag: [tags.special(tags.variableName), tags.macroName],
            color: '#225566',
        },
        {
            tag: tags.definition(tags.propertyName),
            color: '#0000cc',
        },
        {
            tag: tags.comment,
            color: '#6b7677',
        },
        {
            tag: tags.invalid,
            color: '#ff0000',
        },
    ])
}
