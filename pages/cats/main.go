package main

import (
	bytes2 "bytes"
	"encoding/json"
	"fmt"
	"github.com/unidoc/unioffice/document"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
)

//文件处理

//文件路径
var Pwd = ""
var tabDirs []string = []string{"/dsh/", "/tcz/", "/ych/"}

var DshCats []Cat //独墅湖tab猫列表
var TczCats []Cat //天赐庄tab猫列表
var YchCats []Cat //阳澄湖tab猫列表

type Cat struct {
	Name      string
	ImagesUrl []string
	Content   []string
}

func transferDocument(dirs []string) {
	for i, dir := range dirs {
		dir = filepath.Join(Pwd, dir)
		fdirs, err := ioutil.ReadDir(dir)
		if err != nil {
			log.Fatalln("read file error ", dir, err)
		}
		for _, fdir := range fdirs {
			if fdir.IsDir() {
				//猫分类目录
				files, err := ioutil.ReadDir(filepath.Join(dir, fdir.Name()))
				if err != nil {
					log.Fatalln("read file error ", filepath.Join(dir, fdir.Name()), err)
				}
				//处理单个文件下图片文本信息
				var imgs []string
				var content []string
				for _, file := range files {
					suffix := filepath.Ext(file.Name())
					path := filepath.Join(dir, fdir.Name(), file.Name())
					weipath := strings.ReplaceAll(path, "\\", "/")
					index := strings.LastIndex(weipath, "/pages/cats")
					weipath = weipath[index:]
					if suffix == ".png" || suffix == ".PNG" || suffix == ".jpg" || suffix == ".JPG" {
						//为图片格式
						imgs = append(imgs, weipath)
					}
					if suffix == ".docx" {
						//word
						content = readFromWord(path)
					}
				}
				cat := Cat{
					Name:      fdir.Name(),
					ImagesUrl: imgs,
					Content:   content,
				}
				if i == 0 {
					DshCats = append(DshCats, cat)
				}
				if i == 1 {
					TczCats = append(TczCats, cat)
				}
				if i == 2 {
					YchCats = append(YchCats, cat)
				}

			}
		}
	}
}

func readFromWord(word string) (contents []string) {
	doc, err := document.Open(word)
	if err != nil {
		log.Fatalf("error opening document: %s", err)
	}
	defer doc.Close()
	for _, p := range doc.Paragraphs() {
		var text string
		for _, run := range p.Runs() {
			text = fmt.Sprintf("%s%s", text, strings.Trim(run.Text(), "\n"))
		}
		contents = append(contents, text)
		fmt.Println(text)
	}
	//fmt.Print(contents)
	return contents
}
func jsonMarsh(cats []Cat, jsonName string) {
	bytes, err := json.Marshal(cats)
	if err != nil {
		log.Fatalln("json marsh error ", err)
	}
	var outbuffer bytes2.Buffer
	err = json.Indent(&outbuffer, bytes, "", "\t")
	if err != nil {
		log.Fatalln("json marsh error ", err)
	}
	os.Remove(jsonName)
	jsonFile, err := os.OpenFile(jsonName, os.O_RDONLY|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalln("json marsh error ", err)
	}
	jsonFile.Fd()
	jsonFile.WriteString(outbuffer.String())

}
func main() {
	//readFromWord("cat/doc2.docx")
	Pwd, _ = os.Getwd()
	log.Println("pwd ", Pwd)
	log.Println(" parse document start ...")
	transferDocument(tabDirs)
	log.Println(" parse document success ...")
	log.Println("generate dhs.json...")
	jsonMarsh(DshCats, filepath.Join(Pwd, "dsh.json"))
	log.Println("generate tcz.json...")
	jsonMarsh(TczCats, filepath.Join(Pwd, "tcz.json"))
	log.Println("generate ych.json...")
	jsonMarsh(YchCats, filepath.Join(Pwd, "ych.json"))
	log.Println("generate json success...")
}
