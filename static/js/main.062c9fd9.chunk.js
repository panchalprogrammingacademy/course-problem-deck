(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{42:function(e,t,c){},43:function(e,t,c){},48:function(e,t,c){},51:function(e,t,c){},52:function(e,t,c){},70:function(e,t,c){},71:function(e,t,c){},72:function(e,t,c){"use strict";c.r(t);var n=c(0),s=c(1),i=c.n(s),r=c(35),a=c.n(r),o=(c(42),c(21)),l=c(3),j=(c(43),c.p+"static/media/ppa.22a730db.png"),d=c(10),u=(c(48),c(11)),b=c(12),h=function(e){return Object(n.jsxs)("div",{className:"fotter",children:["Copyright \xa9 2020 ",Object(n.jsx)(d.HashLink,{to:"/",onClick:function(e){e.preventDefault(),window.location.href="http://panchalprogrammingacademy.herokuapp.com"},children:"Panchal Programming Academy"}),Object(n.jsx)("br",{}),"Made with ",Object(n.jsx)("span",{children:Object(n.jsx)(u.a,{icon:b.b})})," by ",Object(n.jsx)(d.HashLink,{to:"/",onClick:function(e){e.preventDefault(),window.location.href="http://shubhampanchal.herokuapp.com"},children:"Shubham Panchal"})]})},O=function(e){document.title="Course Problem Deck";var t=[{id:"the-complete-c-course",title:"The Complete C Course",subtitle:"Learn C in this course and become a Computer Programmer. Obtain valuable C skills and problem solving strategy!",instructor:"Shubham Panchal (B.Tech 3rd CSE, IIT Hyderabad)",courseLink:"https://www.udemy.com/course/the-complete-c-course-ppa/?referralCode=E8FBBBCC47B68F60F275"}];return Object(n.jsxs)("div",{id:"homepage",children:[Object(n.jsxs)("div",{className:"header",children:[Object(n.jsx)("img",{src:j,alt:"academyIcon"}),Object(n.jsx)("h1",{children:"Course wise practice problems"})]}),Object(n.jsx)("div",{className:"course",children:t.map((function(e){return Object(n.jsxs)("div",{className:"course-content",children:[Object(n.jsx)("h1",{children:e.title}),Object(n.jsx)("p",{className:"instructor",children:e.instructor}),Object(n.jsx)("p",{className:"subtitle",children:e.subtitle}),Object(n.jsx)(d.HashLink,{to:"/",onClick:function(t){t.preventDefault(),window.open(e.courseLink,"_blank")},className:"browse-course",children:"Browse Course"}),Object(n.jsx)(d.HashLink,{to:"/course/"+e.id,className:"browse-problems",children:"Browse Problems"})]},e.id)}))}),Object(n.jsx)(h,{})]})},m=c(24),x=c(8),p=(c(51),c(52),function(e){return Object(n.jsxs)("div",{id:"loader1",children:[Object(n.jsxs)("div",{className:"lds-facebook",children:[Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{})]}),Object(n.jsx)("div",{children:e.text})]})}),f=c(16),v=c.n(f);v.a.defaults.baseURL="http://localhost:8080";function g(e){var t=e.courseId,c=Object(s.useState)(!0),i=Object(x.a)(c,2),r=i[0],a=i[1],o=Object(s.useState)([]),l=Object(x.a)(o,2),d=l[0],O=l[1],f=Object(s.useState)([]),g=Object(x.a)(f,2),w=g[0],y=g[1],N=Object(s.useState)(null),C=Object(x.a)(N,2),k=C[0],S=C[1],P=Object(s.useState)([]),I=Object(x.a)(P,2),L=I[0],D=I[1],B=Object(s.useState)(""),H=Object(x.a)(B,2),E=H[0],A=H[1];return Object(s.useEffect)((function(){(function(e){return new Promise((function(t,c){v.a.get("/course/"+e).then((function(e){return t(e)})).catch((function(e){return c(e)}))}))})(t).then((function(e){var t=e.data;if(t.error)S(t.error);else{var c=t.problems||[];c.sort((function(e,t){return e.title.localeCompare(t.title)})),O(c),y(c)}})).catch((function(e){S(e)})).finally((function(){a(!1)}))}),[t]),Object(s.useEffect)((function(){y(d.filter((function(e){for(var t=e.tags,c=0;c<L.length;++c)if(-1===t.indexOf(L[c]))return!1;return!0})))}),[L,d]),Object(n.jsxs)("div",{id:"course-page",children:[Object(n.jsxs)("div",{className:"header",children:[Object(n.jsx)("img",{src:j,alt:"academyIcon"}),Object(n.jsx)("h1",{children:t.replaceAll("-"," ")})]}),r&&Object(n.jsx)(p,{text:"Please wait. I'm fetched problems from server!"}),k&&Object(n.jsx)("div",{className:"error-message",children:k}),!r&&!k&&Object(n.jsxs)("div",{className:"problems",children:[Object(n.jsxs)("div",{className:"filter-box",children:[Object(n.jsx)("div",{className:"filter-items",children:L.map((function(e){return Object(n.jsxs)("div",{className:"filter-item",children:[e,Object(n.jsx)("button",{onClick:function(t){var c=Object(m.a)(L),n=c.indexOf(e);c.splice(n,1),D(c)},children:Object(n.jsx)(u.a,{icon:b.c})})]},e)}))}),Object(n.jsx)("input",{type:"text",className:"filter-input",value:E,placeholder:"Add a filter tag and hit enter",onChange:function(e){return A(e.target.value)},onKeyPress:function(e){if("Enter"===e.key){var t=E.trim().toUpperCase();A(""),""!==t&&-1===L.indexOf(t)&&D([].concat(Object(m.a)(L),[t]))}}})]}),w.map((function(e){return Object(n.jsxs)("div",{className:"problem",children:[localStorage.getItem(e._id)&&Object(n.jsx)("span",{children:Object(n.jsx)(u.a,{icon:b.a})}),Object(n.jsx)("a",{href:"/",className:"problem-title",onClick:function(t){t.preventDefault();var c=window.location.origin+"/#/problem/"+e._id;window.open(c,"_blank")},children:e.title})]},e._id)})),0===w.length&&Object(n.jsx)("div",{className:"empty-message",children:"Oops, nothing to show here!"})]}),Object(n.jsx)(h,{})]})}var w=c.p+"static/media/404.49094bca.gif",y=function(e){return document.title="Course Problem Deck | Page Not Found",Object(n.jsxs)("div",{id:"pageNotfound",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-around",height:"100vh",padding:"0px",margin:"0px",overflow:"hidden"},children:[Object(n.jsx)("img",{src:w,alt:"lostImage"}),Object(n.jsxs)("div",{style:{textAlign:"center"},children:[Object(n.jsxs)("p",{style:{fontSize:"20px",textAlign:"center"},children:["Uh oh! The page you are looking for does not exist! ",Object(n.jsx)("br",{})]}),Object(n.jsx)(d.HashLink,{to:"/",style:{background:"#17a2bb",color:"white",padding:"10px",borderRadius:"10px",margin:"10px",textDecoration:"none",fontSize:"20px"},children:"Home"})]})]})};c(70),c(71);function N(e){return Object(n.jsx)("div",{className:"loader2",children:Object(n.jsx)("div",{className:"lds-circle",children:Object(n.jsx)("div",{})})})}function C(e){var t=Object(s.useState)(""),c=Object(x.a)(t,2),i=c[0],r=c[1],a=Object(s.useState)(""),o=Object(x.a)(a,2),l=o[0],j=o[1],d=Object(s.useState)(""),h=Object(x.a)(d,2),O=h[0],m=h[1],p=Object(s.useState)(""),f=Object(x.a)(p,2),g=f[0],w=f[1],y=Object(s.useState)(!1),C=Object(x.a)(y,2),k=C[0],S=C[1];return Object(n.jsxs)("div",{id:"login",children:[O&&Object(n.jsxs)("div",{className:"flash-message error",children:[Object(n.jsx)("div",{children:"this is a busy day"}),Object(n.jsx)("div",{children:Object(n.jsx)("button",{onClick:function(e){return m("")},children:Object(n.jsx)(u.a,{icon:b.c})})})]}),g&&Object(n.jsxs)("div",{className:"flash-message success",children:[Object(n.jsx)("div",{children:g}),Object(n.jsx)("div",{children:Object(n.jsx)("button",{onClick:function(e){return w("")},children:Object(n.jsx)(u.a,{icon:b.c})})})]}),Object(n.jsx)("h1",{children:"LOGIN"}),Object(n.jsxs)("form",{method:"POST",autoComplete:"off",onSubmit:function(e){e.preventDefault(),k||(S(!0),function(e,t){return new Promise((function(c,n){v.a.post("/admin/login",{email:e,password:t}).then((function(e){return c(e)})).catch((function(e){return n(e)}))}))}(i,l).then((function(e){var t=e.data;t.error?m(t.error):w("You are successfully logged in!")})).catch((function(e){m(e)})).finally((function(){S(!1)})))},children:[Object(n.jsxs)("div",{className:"form-group",children:[Object(n.jsx)("label",{children:"Email address"}),Object(n.jsx)("input",{type:"email",required:!0,value:i,onChange:function(e){return r(e.target.value)}})]}),Object(n.jsxs)("div",{className:"form-group",children:[Object(n.jsx)("label",{children:"Password"}),Object(n.jsx)("input",{type:"password",required:!0,value:l,onChange:function(e){return j(e.target.value)}})]}),k&&Object(n.jsx)(N,{}),!k&&Object(n.jsx)("button",{type:"submit",className:"btn btn-primary",children:"Submit"})]})]})}function k(){return Object(n.jsx)("div",{className:"App",children:Object(n.jsx)(o.HashRouter,{children:Object(n.jsxs)(l.g,{children:[Object(n.jsx)(l.d,{exact:!0,path:"/",component:O}),Object(n.jsx)(l.d,{exact:!0,path:"/admin/login",component:C}),Object(n.jsx)(l.d,{exact:!0,path:"/course/the-complete-c-course",component:function(){return Object(n.jsx)(g,{courseId:"the-complete-c-course"})}}),Object(n.jsx)(l.d,{path:"/",component:y})]})})})}a.a.render(Object(n.jsx)(i.a.StrictMode,{children:Object(n.jsx)(k,{})}),document.getElementById("root"))}},[[72,1,2]]]);
//# sourceMappingURL=main.062c9fd9.chunk.js.map