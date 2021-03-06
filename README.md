# mdtodocs

`mdtodocs`는 [pandoc 문서 변환기](https://pandoc.org/)를 통해, `md`파일을 `docx`, `pdf` 파일로 변환시켜주는 도구입니다.


## 설치하기

### For Mac

[pandoc](http://pandoc.org/installing.html) 설치

```
brew install pandoc
```

[miktex](https://tex.stackexchange.com/questions/97183/what-are-the-practical-differences-between-installing-latex-from-mactex-or-macpo) 설치

```
brew cask install mactex 
```

### For Windows

[pandoc](https://github.com/jgm/pandoc/releases/tag/2.1.3) 설치

[miktex](https://miktex.org/download) 설치

> 문서 변환 시, `tex` 관련 패키지들을 설치하라는 메시지가 나올경우, 해당 패키지를 모두 설치하면된다.

### (나눔)글꼴 설치

http://hangeul.naver.com/font

### `mdtodocs` 설치

```
npm i -g mdtodocs
```

## .mdtodocs.json

파일은 기본 설정 및 `pandoc`이 제공하는 [options](https://pandoc.org/MANUAL.html#options) 과 [variables](https://pandoc.org/MANUAL.html#templates) 를 설정할 수 있습니다.

파일은 반드시 `cli`실행 경로에 위치해야하며, 변환 시 사용될 `root`경로도 `cli` 실행 위치와 같습니다.

```
// 설정된 상대 경로는 이와 같이 절대 변경로 변경됩니다.
"reference-doc": "templates/default.docx" // "root(cli 실행 위치)/templates/default.docx"
```

> 아래 설정은 `example 프로젝트`를 기준으로 작성된 파일입니다.

```
{
  "src": [
    "src/**/*.md"
  ],
  "dist": "docs",
  "outputTypes": ["docx", "latex"],
  "templates": {
    "docx": {
	  "options": {
	    "reference-doc": "templates/default.docx"
	  },
	  "variables": {
	    "pointsize": "14p",
	    ...
	  }
	},
	"latex": {
	  "options": {
	    "template": "templates/default.latex",
	    "include-in-header": "templates/header.latex",
	    ...
	    },
	  "variables": {
	    "documentclass": "report",
	    ...
	  }
	}
  }
}
```

|이름|설명|
|:--:|:----------|
|`src`|변환될  `md`파일 위치를 지정합니다.([glob](https://github.com/isaacs/node-glob) 패턴을 사용할 수 있습니다)
|`dist`|출력 파일 위치를 지정합니다.
|`outputTypes`|출력 타입을 지정합니다.(현재 `docx`, `latex(pdf)`만 제공합니다)
|`templates`|템플릿을 설정합니다.
|`options`| [pandoc options](https://pandoc.org/MANUAL.html#options) 을 설정합니다.
|`variables`|[pandoc variables](https://pandoc.org/MANUAL.html#templates) 을 설정합니다.

## CLI 사용 방법

```
usage: mdtodocs [-h] [-v] [--verbose VERBOSE]

mdtodocs cli example

Optional arguments:
  -h, --help         Show this help message and exit.
  -v, --version      Show program's version number and exit.
  --verbose VERBOSE  Display the progress message.
```

> 문서를 변환합니다.

```
mdtodocs
```
