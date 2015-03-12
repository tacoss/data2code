# Generator spec

 * Required properties:
    * template | templates -> Handlebars templates.

 * Optional properties:
    * parser(data) -> Function that receives data (in raml2code it pases  RAML object), returns the context for handlebars templates, it could return
    and array
      The parser must return and array of object each object must have name and content properties
    * helpers -> Handlebars helpers.
    * partials -> Handlebars partials.

##Simple definition:
```javascript
var gen = {
  template: {'readme.md' : '{{title}}'
}
```

##Interpolating name:
The name is also a handlebars template it will use the context to generate the final name.
```javascript
var gen = {
  template: {'readme{{title}}.md' : '{{title}}'
}
```

##Defining a parser:
A parser could be used to modify or adapt the data, generally is used
to reduce login in the template
```javascript
var gen = {
  template: {'readme{{title}}.md' : '{{title}}',
  parser: function(data){}
}
```
A parse could return and array, each element of the array will be passed to the template, this is useful to
generate multiple files.

##Multiple templates using the same parser:
```javascript
var gen = {
  templates: [{'readme{{title}}.md' : '{{title}}', {'{{className}}Resource.java' : '{{title}}'],
  parser: function(data){}
}
```

##Multiple templates each one using different parser:
```javascript
var gen = {
   templates: [
      {
        '{{name}}Resource.java': {
          tmpl: 'hola {{title}}',
          parser: function () {
            return [{title: 'parse1', name: 'test'}]
          }
        }
      },
      {
        '{{name}}.md': {
          tmpl: 'readme {{title}}',
          parser: function () {
            return [{title: 'parse2', name: 'readme'}]
          }
        }
      }
    ]
}
```
