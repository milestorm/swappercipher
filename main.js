"use strict";function createArray(e){var t=new Array(e||0),r=e;if(1<arguments.length)for(var n=Array.prototype.slice.call(arguments,1);r--;)t[e-1-r]=createArray.apply(this,n);return t}function keyPosInc(e){return++e>secretKey.length-1&&(e=0),e}function keyPosDec(e){return--e<0&&(e=secretKey.length-1),e}function shuffleEncode(e){for(var t=0,r=void 0,n=void 0,u=void 0,o=void 0,c=0;c<e.length;c++)for(var l=0;l<e[0].length;l++)u=secretKey[t][0],o=secretKey[t][1],(l+u<0||c+o<0||l+u>e[0].length-1||c+o>e.length-1)&&(o=u=0),r=e[c][l],n=e[c+o][l+u],e[c][l]=n,e[c+o][l+u]=r,t=keyPosInc(t);return e}function shuffleDecode(e){for(var t=secretKey.length-1,r=void 0,n=void 0,u=void 0,o=void 0,c=e.length-1;0<=c;c--)for(var l=e[0].length-1;0<=l;l--)u=secretKey[t][0],o=secretKey[t][1],(l+u<0||c+o<0||l+u>e[0].length-1||c+o>e.length-1)&&(o=u=0),r=e[c][l],n=e[c+o][l+u],e[c][l]=n,e[c+o][l+u]=r,t=keyPosDec(t),0==l&&(u=secretKey[t][0],o=secretKey[t][1],(l+u<0||c+o<0||l+u>e[0].length-1||c+o>e.length-1)&&(u=secretKey[t][0],o=secretKey[t][1]));return e}function prettyPrintArray(e){var t="";return e.forEach(function(e){e.forEach(function(e){t+=e+" "}),t=t.slice(0,-1),t+="\n"}),t}function encodedTextToArray(e){var t=e.replace(/ +?/g,""),r=(t.match(/\n/g)||"").length+1,n=t.split("\n")[0].length;t=t.replace(/\n/g,"");for(var u=createArray(r,n),o=0,c=0;c<u.length;c++)for(var l=0;l<u[0].length;l++)u[c][l]=t.substr(o,1),o++;return u}function inputTextToArray(e){var t=e.replace(/[.,\/#?!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s/g,"").toUpperCase();if(t.length%secretKey.length!=0)for(var r=secretKey.length-t.length%secretKey.length,n=0;n<r;n++)t+=".";for(var u=void 0,o=void 0,c=secretKey.length+1;c<16;c++)if(t.length%c==0){u=c,o=t.length/c;break}for(var l=createArray(u,o),a=0,s=0;s<l.length;s++)for(var i=0;i<l[0].length;i++)l[s][i]=t.substr(a,1),a++;return l}function errorCheck(e,t,r){var n=e.value,u=t.value,o=!0,c=!0;return r.innerText="",n.length<5&&(r.innerText+="Input must contain at least 5 characters.\n",r.classList.remove("hidden"),o=!1),1==useCustomKey&&u.length<4&&(r.innerText+="Custom key must contain at least 4 characters.\n",r.classList.remove("hidden"),c=!1),1==(o&&c)&&r.classList.add("hidden"),o&&c}function makeCustomKey(e){var t=e.value.toUpperCase().replaceAll(/[^UDLR]/g,"");return(t=(e.value=t).split("")).map(function(e){switch(e){case"R":return[1,0];case"U":return[0,-1];case"L":return[-1,0];case"D":return[0,1]}})}var defaultKey=[[1,0],[0,-1],[-1,0],[0,1]],secretKey=defaultKey,useCustomKey=!1,customKey=void 0,inputElm=document.querySelector(".inputCode"),errElm=document.querySelector(".errormessage"),outputEnablerElm=document.querySelector(".outputText"),outputHeading=document.querySelector(".outputHeading"),outputElm=document.querySelector(".outputCode"),customKeyElm=document.querySelector("input.key");document.querySelector(".button.encode").addEventListener("click",function(){if(errorCheck(inputElm,customKeyElm,errElm)){secretKey=useCustomKey?makeCustomKey(customKeyElm):defaultKey;var e=shuffleEncode(inputTextToArray(inputElm.value));outputElm.innerText=prettyPrintArray(e),outputHeading.innerText="Encoded output",outputEnablerElm.classList.remove("hidden")}}),document.querySelector(".button.decode").addEventListener("click",function(){if(errorCheck(inputElm,customKeyElm,errElm)){secretKey=useCustomKey?makeCustomKey(customKeyElm):defaultKey;var e=shuffleDecode(encodedTextToArray(inputElm.value));outputElm.innerText=prettyPrintArray(e),outputHeading.innerText="Decoded output",outputEnablerElm.classList.remove("hidden")}}),$(".customKey").click(function(){$(".customKeyWrap .inputWrap").slideToggle(),useCustomKey=!useCustomKey}),$(document).ready(function(){$(".customKeyWrap .inputWrap").hide()});
//# sourceMappingURL=main.js.map