import scrollDirObservable from 'scrolldir-observable'

export const setScrollDir = (onChange) => {
    const scrollDir = scrollDirObservable(window.document)
    scrollDir.subscribe(dir => onChange(dir === 'down'))
}
