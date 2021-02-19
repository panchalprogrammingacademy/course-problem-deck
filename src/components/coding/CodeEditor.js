import React, { useState } from 'react';
import './styles/CodeEditor.scss';
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-chaos';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-clouds';
import 'ace-builds/src-noconflict/theme-clouds_midnight';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/theme-crimson_editor';
import 'ace-builds/src-noconflict/theme-dawn';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-dreamweaver';
import 'ace-builds/src-noconflict/theme-eclipse';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-gob';
import 'ace-builds/src-noconflict/theme-gruvbox';
import 'ace-builds/src-noconflict/theme-idle_fingers';
import 'ace-builds/src-noconflict/theme-iplastic';
import 'ace-builds/src-noconflict/theme-katzenmilch';
import 'ace-builds/src-noconflict/theme-kr_theme';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-merbivore';
import 'ace-builds/src-noconflict/theme-merbivore_soft';
import 'ace-builds/src-noconflict/theme-mono_industrial';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-nord_dark';
import 'ace-builds/src-noconflict/theme-pastel_on_dark';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-sqlserver';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue';
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-vibrant_ink';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';


// functional component
export default function CodeEditor(props){
    // configurations
    const themes = [
        {theme: 'ambiance', text: 'Ambiance'},
        {theme: 'chaos', text: 'Chaos'},
        {theme: 'chrome', text: 'Chrome'},
        {theme: 'clouds', text: 'Clouds'},
        {theme: 'clouds_midnight', text: 'Clouds Midnight'},
        {theme: 'cobalt', text: 'Cobalt'},
        {theme: 'crimson_editor', text: 'Crimson Rditor'},
        {theme: 'dawn', text: 'Dawn'},
        {theme: 'dracula', text: 'Dracula'},
        {theme: 'dreamweaver', text: 'Dreamweaver'},
        {theme: 'eclipse', text: 'Eclipse'},
        {theme: 'github', text: 'GitHub'},
        {theme: 'gob', text: 'Gob'},
        {theme: 'gruvbox', text: 'Gruvbox'},
        {theme: 'idle_fingers', text: 'Idle Fingers'},
        {theme: 'iplastic', text: 'Iplastic'},
        {theme: 'katzenmilch', text: 'Katzenmilch'},
        {theme: 'kr_theme', text: 'KR Theme'},
        {theme: 'kuroir', text: 'Kuroir'},
        {theme: 'merbivore', text: 'Merbivore'},
        {theme: 'merbivore_soft', text: 'Merbivore Soft'},
        {theme: 'mono_industrial', text: 'Mono Industrial'},
        {theme: 'monokai', text: 'Monokai'},
        {theme: 'nord_dark', text: 'Nord Dark'},
        {theme: 'pastel_on_dark', text: 'Pastel on Dark'},
        {theme: 'solarized_dark', text: 'Solarized Dark'},
        {theme: 'solarized_light', text: 'Solarized Light'},
        {theme: 'sqlserver', text: 'SQL Server'},
        {theme: 'terminal', text: 'Terminal'},
        {theme: 'textmate', text: 'Textmate'},
        {theme: 'tomorrow', text: 'Tomorrow'},
        {theme: 'tomorrow_night', text: 'Tomorrow Night'},
        {theme: 'tomorrow_night_blue', text: 'Tomorrow Night Blue'},
        {theme: 'tomorrow_night_bright', text: 'Tomorrow Night Bright'},
        {theme: 'tomorrow_night_eighties', text: 'Tomorrow Night Eighties'},
        {theme: 'twilight', text: 'Twilight'},
        {theme: 'vibrant_ink', text: 'Vibrant Ink'},
        {theme: 'xcode', text: 'XCode'},                
    ];
    const langModeMapping = {
        'C' : 'c_cpp',
        'Python2': 'python',
        'Python3': 'python'
    };
    // [
    //     {lang: 'C',         mode: 'c_cpp'},
    //     {lang: 'Python2',   mode: 'python'},
    //     {lang: 'Python3',   mode: 'python'},
    // ];

    // states for maintaing component
    const {code, setCode, language, setLanguage} = props;
    // let defaultMode = langModeMapping[language];
    // const [editorMode, setEditorMode] = useState(defaultMode);
    const [editorTheme, setEditorTheme] = useState('eclipse');

    return (
        <div className="code-editor">
            <div className="toolbar">
                <select onChange={event => setEditorTheme(event.target.value)}
                    value={editorTheme}>
                    {themes.map(theme => <option key={theme.theme} 
                        value={theme.theme}>{theme.text}</option>)}
                </select>
                <select onChange={event => setLanguage(event.target.value)} 
                    value={language}>
                    {function(){
                        let items = [];
                        for (let lang in langModeMapping){
                            let item = (
                                <option key={lang} value={lang}>{lang}</option>
                            );
                            items.push(item);
                        }
                        return items;
                    }()} 
                    {/* {languages.map(lang => <option key={lang.lang} 
                        value={lang.mode}>{lang.lang}</option>)} */}
                </select>
            </div>
            <AceEditor mode={langModeMapping[language]} theme={editorTheme}
                value={code} onChange={setCode}/>
        </div>
    );
};