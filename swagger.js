var swagger;

var messages = [];

var jsonSwaggerEditor = CodeMirror.fromTextArea(document.getElementById("code"), {
    matchBrackets: true,
    autoCloseBrackets: true,
    mode: "application/ld+json",
    lineWrapping: true,
    lineNumbers: true
});

var jsonResponseEditor = CodeMirror.fromTextArea(document.getElementById("code2"), {
    matchBrackets: true,
    autoCloseBrackets: true,
    mode: "application/ld+json",
    lineWrapping: true,
    lineNumbers: true
});

init();
addListeners();

function addInfo(message) {
    messages.push({"type": "INFO", "text" : message});
}

function addWarning(message) {
    messages.push({"type": "WARNING", "text" : message});
}

function addError(message) {
    messages.push({"type": "ERROR", "text" : message});
}

function init() {
    messages = [];
    enableButtons(false);
}

function addListeners() {
    var selectPaths = document.getElementById("paths");
    selectPaths.addEventListener("change", function(){
      var path = selectPaths.value;
      // Remove Methods Options
      if (paths == '') {
        var methods = document.getElementById("methods");
        removeAllOptions(methods);
      }
      // Load Methods Options
      loadMethods(path);
    });
}

function loadMethods(path) {
    console.log("Path:" + path );
    // Se obtienen los jsons;
    var jsonMethods = eval("swagger.paths[\"" + path + "\"]");
    console.log(jsonMethods);
    var methods = Object.keys(jsonMethods);

    console.log("methods:" + methods);
    console.log("methods.length:" + methods.length);

    // Remove Paths options
    var selectMethods = document.getElementById("methods");
    removeAllOptions(selectMethods);

    // Add options
    for (var i = 0; i< methods.length; i++){
        var opt = document.createElement('option');
        opt.value = methods[i];
        opt.innerHTML = methods[i].toUpperCase();
        selectMethods.appendChild(opt);
    }
}

function load() {
    // Se obtienen los jsons;
    var jsonSwagger = jsonSwaggerEditor.getValue();
    var jsonResponse = jsonResponseEditor.getValue();
    // console.log("jsonSwagger: " + jsonSwagger);
    // console.log("jsonResponseEditor: " + jsonResponse);

    if (jsonSwagger == "") {
        Swal.fire({
            icon: 'warning',
            html: '<p style="font-family: sans-serif">You must put a JSON Swagger to load the resources!</p>',
        });
        return;
    }

    // Se convierten a objetos los JSONs.
    swagger = JSON.parse(jsonSwagger);
    var response = JSON.parse(jsonSwagger);
    //console.log("swagger:" + swagger);
    //console.log("response:" + response);

    // Se obtienen los resources
    var resources = Object.keys(swagger.paths);
    loadPaths(resources);
    //console.log("Resources:" + resources);
    //console.log(resources[0]);

    // Se obtiene el objeto por key
    //var obj1 = swagger.paths["/solicitudIndividual"];
    //console.log(obj1);

    // Se habilitan los botones.
    enableButtons(true);
}

function loadPaths(paths) {
    // Remove Paths options
    var selectPaths = document.getElementById("paths");
    removeOptions(selectPaths);

    // Add options
    for (var i = 0; i< paths.length; i++){
        var opt = document.createElement('option');
        opt.value = paths[i];
        opt.innerHTML = paths[i];
        selectPaths.appendChild(opt);
    }
}

function enableButtons(enable) {
    var select = document.getElementById("paths");
    var methods = document.getElementById("methods");
    var clean = document.getElementById("clean");
    var validate = document.getElementById("validate");
    if (enable) {
        select.disabled = "";
        methods.disabled = "";
        clean.disabled = "";
        validate.disabled = "";
    } else {
        select.disabled = true;
        methods.disabled = true;
        clean.disabled = true;
        validate.disabled = true;
    }
}

function clean() {
    //Se limpia el div con los mensajes previos.
    var div = document.getElementById("messagesError");
    div.innerHTML = "";

    // Se remueve el contenido del swagger y del response.
    jsonSwaggerEditor.setValue("");
    jsonResponseEditor.setValue("");

    // Remove options of paths
    var paths = document.getElementById("paths");
    removeOptions(paths);

    // Remove options of methods
    var methods = document.getElementById("methods");
    removeAllOptions(methods);

    init();
}

function removeAllOptions(selectElement) {
  for (var i = selectElement.length - 1; i >= 0; i--) {
      console.log("Remove" + i);
      selectElement.remove(i);
  }
}

function removeOptions(selectElement) {
  for (var i = selectElement.length - 1; i > 0; i--) {
      selectElement.remove(i);
  }
}

function validate() {

    // Se eliminan los mensajes previos.
    //Se limpia el div con los mensajes previos.
    var div = document.getElementById("messagesError");
    div.innerHTML = "";
    messages = [];

    var select = document.getElementById("paths");
    var resource = select.value;
    if (resource == "") {
        Swal.fire({
            icon: 'warning',
            html: '<p style="font-family: sans-serif">You must select a Resource to validate the JSON Response!</p>',
        });
        return;
    }

    // Se obtienen los jsons;
    var jsonSwagger = jsonSwaggerEditor.getValue();
    var jsonResponse = jsonResponseEditor.getValue();
    if (jsonSwagger == "") {
        Swal.fire({
            icon: 'warning',
            html: '<p style="font-family: sans-serif">You must put a JSON Swagger to validate the JSON Response!</p>',
        });
        return;
    }
    if (jsonResponse == "") {
        Swal.fire({
            icon: 'warning',
            html: '<p style="font-family: sans-serif">You must put a JSON Response to validate the JSON Response!</p>',
        });
        return;
    }

    // Se convierten los JSONs a objetos JavaScript.
    swagger = JSON.parse(jsonSwagger);
    var response = JSON.parse(jsonResponse);

    addInfo("Resource: " + "<b>" + resource + "</b>");

    // Se obtiene el objeto por key
    var jsonResource = swagger.paths[resource];
    //console.log(jsonResource);
    var methods = Object.keys(jsonResource);


    // TODO solo se considera el primer metodo por Recurso.
    // Se obtiene el metodo del combo.

    var method = document.getElementById("methods").value.toLowerCase();
    console.log("method:" + method);
    console.log("method:" + method);
    console.log("method:" + method);


    //var method = methods[0];
    addInfo("Method: " + "<b>" + method + "</b>");

    var responses = Object.keys(swagger.paths[resource][method]["responses"]);
    var consumes;
    var produces;
    //var description = Object.keys(swagger.paths[resource][method]["description"]);
    var description = swagger.paths[resource][method]["description"];

    addInfo("Description: " + "<b>" + description + "</b>");

    if (swagger.paths[resource][method]["consumes"] != undefined) {
        consumes = swagger.paths[resource][method]["consumes"];
        addInfo("Consumes: " + "<b>" + consumes + "</b>");
    }
    if (swagger.paths[resource][method]["produces"] != undefined) {
        produces = swagger.paths[resource][method]["produces"];
        //addInfo("Produces: " + "<b>" + produces + "</b>");
    }

    //console.log("responses: " + responses);
    //console.log("consumes[0]: " + consumes[0]);
    //console.log("produces[0]: " + produces[0]);
    //console.log("description: " + description);

    var code = responses[0];
    addInfo("HTTP Code: " + "<b>" + code + "</b>");

    //console.log("code: " + code);
    var description = swagger.paths[resource][method]["responses"][code].description;
    //console.log("descripcion: " + description);
    var ref = swagger.paths[resource][method]["responses"][code].schema["$ref"];
    var definition = ref.substring(ref.lastIndexOf("/") + 1, ref.length);
    addInfo("Schema: " + "<b>" + definition + "</b>");
    //console.log("definition: " + definition);

    var objDefinitionSwagger = getDefinition(definition);
    //console.log("objDefinitionSwagger");
    //console.log(objDefinitionSwagger);

    var paths=[];
    validateResponse(objDefinitionSwagger, response, paths);

    showMessages();
}

function showMessages() {
    // Se obtiene el elemento div para agregar mensaje span.
    var div = document.getElementById("messagesError");

    var message;
    var indexError = 0;
    for (var i = 0; i < messages.length; i++) {
        message = messages[i];

        var class_;
        if (message.type == 'ERROR') {
            class_ = "error";
            indexError++;
        } else if (message.type == 'INFO') {
            class_ = "info";
        } else if (message.type == 'WARNING') {
            class_ = "warning";
        }

        //var newSpan = document.createElement('span');
        //div.appendChild('<span class="' + class_  + '">' + message.text + '</span>');
        if (message.type == 'ERROR') {
            div.innerHTML += '<span class="' + class_  + '">' + indexError + ".- " + message.text + '</span>';
        } else {
            div.innerHTML += '<span class="' + class_  + '">' + message.text + '</span>';
        }
    }
}

/* path: {nanme: "", type: "", index: ""} */

function buildSwaggerPath(paths) {
    var path;
    var swaggerPath = "";
    for (var i = 0; i < paths.length; i++) {
        path = paths[i];
        if (path.type == 'array') {
            swaggerPath = swaggerPath + "." + path.name + ".item";
        } else if (path.type == 'object') {
            swaggerPath = swaggerPath + "." + path.name;
        }
    }
    //console.log("swaggerPath: " + swaggerPath);
    return swaggerPath;
}

function buildResponsePath(paths) {
    var path;
    var responsePath = "";
    for (var i = 0; i < paths.length; i++) {
        path = paths[i];
        if (path.type == 'array') {
            responsePath = responsePath + "." + path.name + "[" + path.index + "]";
        } else if (path.type == 'object') {
            responsePath = responsePath + "." + path.name;
        }
    }
    //console.log("responsePath: " + responsePath);
    return responsePath;
}

function validateResponse(objDefinitionSwagger, response, paths) {
    var obj = eval("response" + buildResponsePath(paths));
    var type = getType(obj);

    // Se valida si el atributo son simples valores p. ej. telefono["5523233445", "5523233445"]
    if (type == 'string' || type == 'integer' || type == 'boolean') { //.respuesta.contratante.mediosContacto.telefono.item
        var responsePath = buildResponsePath(paths);
        var objSwagger = eval("objDefinitionSwagger" + buildSwaggerPath(paths));
        if (objSwagger == undefined) {
            addError("El atributo [<b>" + responsePath + " = " + obj + "</b>] no existe en la definici\u00F3n swagger!");
            console.log("El atributo [" + responsePath + " = " + obj + "] no existe en la definici\u00F3n swagger!");
        } else if (type !== objSwagger.type && type != "null") {
            addError("El atributo [<b>" + responsePath + " = " + obj + "</b>] esta definido como ['" + objSwagger.type+ "'] pero es de tipo ['" + type + "']!");
            console.log("El atributo [" + responsePath + " = " + obj + "] esta definido como ['" + objSwagger.type+ "'] pero es de tipo ['" + type + "']!");
        } else {
            //console.log("OK El atributo [" + responsePath + " = " + obj + "]");
        }
        return;
    }

    // Se obtienen los elementos hijos del response.
    //console.log("Se obtienen los elementos hijos del response...");
    var nodes = eval("Object.entries(response" + buildResponsePath(paths) + ")");
    for (var i=0; i< nodes.length; i++) {
        var key = nodes[i][0];
        var value = nodes[i][1];
        var type = getType(value);
        //console.log("key: " + key);
        //console.log("value: " + value);
        //console.log("type: " + type);

        // Se valida el elemento como de tipo array.
        if (type == 'object' || type == 'array') {

            //console.log("El valor del elemento: " + key + " es un " + type);

            // Se obtiene el elemento del swagger.
            var objSwagger = eval("objDefinitionSwagger" + buildSwaggerPath(paths)  + "." + key);
            //console.log("objSwagger.type:" + objSwagger.type);

            if (objSwagger == undefined) {
                addError("El atributo [<b>" + key + "</b>] no existe en la definici\u00F3n swagger!");
                console.log("El atributo [" + key + "] no existe en la definici\u00F3n swagger!");
                return;
            } else if (type !== objSwagger.type && type != "null") {
                addError("El atributo [<b>" + key + "</b>] esta definido como ['" + objSwagger.type+ "'] pero es de tipo ['" + type + "']!");
                console.log("El atributo [" + key + "] esta definido como ['" + objSwagger.type+ "'] pero es de tipo ['" + type + "']!");
                return;
            } else {
                //console.log("OK El atributo [" + key + "]");
                //console.log("22222222222222222");

                // Se validan los elementos del array.
                if (type == 'array') {
                    // Se obtiene el tamaño del array.
                    var arrayLength = eval("response" + buildResponsePath(paths) + "." + key + ".length");
                    //console.log("La longitud del arreglo es: " + arrayLength + " del arreglo:" + key);
                    // Se recorren todos los elemento del array.

                    var path;
                    var newPaths;
                    for (var j = 0; j < arrayLength; j++) {
                        // Se valida cada elemento del array.
                        path = {
                            "name"  : key,
                            "type"  : type,
                            "index" : j
                        };
                        newPaths = paths.slice();
                        newPaths.push(path);

                        //console.log("Se valida el elemento [" + j + "] del arreglo " + key);
                        validateResponse(objDefinitionSwagger, response, newPaths);

                        //console.log("Termina de validar el elemento [" + j + "] del arreglo: " + key);
                        //console.log("Paths despues de validar el elemento: ");
                        //console.log(paths);
                    }

                // Se validan los elementos del objeto.
                } else if (type == 'object') {
                    //console.log("Se valida el objeto: " + key);
                    var path = {
                        "name"  : key,
                        "type"  : type
                    };
                    var newPaths = paths.slice();
                    newPaths.push(path);

                    validateResponse(objDefinitionSwagger, response, newPaths);
                }
            }
        // Se valida el atributo si es de tipo: string, integer, boolean, etc... codPostal: "04470", municipio: "Coyoacan"
        } else {
            // Se validan tipos primarios de datos.
            var objSwagger = eval("objDefinitionSwagger" + buildSwaggerPath(paths)  + "." + key);
            //console.log("objSwagger.type:" + objSwagger.type);

            if (objSwagger == undefined) {
                addError("El atributo [<b>" + key + "</b>] no existe en la definici\u00F3n swagger!");
                console.log("El atributo [" + key + "] no existe en la definici\u00F3n swagger!");
                //return;
            } else if (type !== objSwagger.type && type != "null") {
                addError("El atributo [<b>" + key + "</b>] esta definido como ['" + objSwagger.type+ "'] pero es de tipo ['" + type + "']!");
                console.log("El atributo [" + key + "] esta definido como ['" + objSwagger.type+ "'] pero es de tipo ['" + type + "']!");
                //return;
            } else {
                //console.log("OK El atributo [" + key + "]");
            }
        }
    }
}

function getType(value) {
    if (value == null) {
        return "null";
    } else if (Array.isArray(value)) {
        return "array";
    } else if (typeof value === 'object') {
        return "object";
    } else if (typeof value === 'string') {
        return "string";
    } else if (typeof value === 'number') {
        return "integer";
    } else if (typeof value === 'boolean') {
        return "boolean";
    }
}

function getNode(nodeSwaggerDefinition) {
    //console.log("getNode() nodeSwaggerDefinition:");
    //console.log(nodeSwaggerDefinition);

    var typeOrRef = Object.keys(nodeSwaggerDefinition);
    //console.log("typeOrRef:");
    //console.log(typeOrRef);

    //console.log("typeOrRef[0]:" + typeOrRef[0]);
    // Se valida si es type o Ref
    if ( typeOrRef[0] == "$ref" ) {
        var propertyRef = nodeSwaggerDefinition[typeOrRef[0]];
        //console.log("propertyRef: " + propertyRef);
        var propertyDefinition = propertyRef.substring(propertyRef.lastIndexOf("/") + 1, propertyRef.length);
        return getDefinition(propertyDefinition);
    } else if ( typeOrRef[0] == "type" ) {

        var typeOfProperty = nodeSwaggerDefinition[typeOrRef[0]];
        //console.log("typeOfProperty:" + typeOfProperty );
        if (typeOfProperty == "string") {
            var obj = Object.create({});
            obj.type = "string";
            return obj;
        } else if (typeOfProperty == "integer") {
            var obj = Object.create({});
            obj.type = "integer";
            return obj;
        } else if (typeOfProperty == "boolean") {
            var obj = Object.create({});
            obj.type = "boolean";
            return obj;
        }

        else if (typeOfProperty == 'object'){
            var arrayProperties = Object.keys(nodeSwaggerDefinition["properties"]);
            obj.type = "object";

            // Por cada propiedad se consultan sus items.
            for (var i = 0; i < arrayProperties.length; i++) {
                property = arrayProperties[i];
                //console.log("property:" + property);
                obj[property] = getNode(nodeSwaggerDefinition["properties"][property]);

                //console.log("obj[" + property + "]");
                //console.log(obj[property]);
            }

            return obj;
        } else if (typeOfProperty == 'array') {
            //console.log("TODO typeOfProperty: Array.......");
            // Se obtienen los items del array.
            // Se obtiene el tipo de objecto del item del array.
            var typeOrRef = Object.keys(nodeSwaggerDefinition["items"]);
            //console.log("getDefinition() item:" + typeOrRef);
            //console.log("getDefinition()typeOrRef[0]=" + typeOrRef[0]);

            var obj = Object.create({});
            obj.type = "array";
            obj.item = [];

            if ( typeOrRef[0] == "$ref" ) {
                var propertyRef = nodeSwaggerDefinition["items"][typeOrRef[0]];
                //console.log("propertyRef:" + propertyRef);
                //console.log("propertyRef: " + propertyRef);
                var propertyDefinition = propertyRef.substring(propertyRef.lastIndexOf("/") + 1, propertyRef.length);
                //console.log("propertyDefinition:" + propertyDefinition);
                //obj.item["object"] = getDefinition(propertyDefinition);   ************************

                obj["item"] = getDefinition(propertyDefinition);
            } else if (typeOrRef[0] == "type") {
                var typeOfProperty = nodeSwaggerDefinition["items"]["type"];
                //console.log("typeOfProperty:" + typeOfProperty );
                if (typeOfProperty == "string") {
                    var objProperty = Object.create({});
                    objProperty.type = "string";
                } else if (typeOfProperty == "integer") {
                    var objProperty = Object.create({});
                    objProperty.type = "integer";
                } else if (typeOfProperty == "boolean") {
                    var objProperty = Object.create({});
                    objProperty.type = "boolean";
                } else {
                    console.log("TIPO DE PROPIEDAD NO PROGRAMADA!!!");
                }
                obj["item"] = objProperty;
            }
            return obj;
        }
    }
}

function getDefinition(definition) {
    var obj = Object.create({});
    var property;
    //console.log("defintion:" + definition);

    // Se obtiene el tipo de nodo del Swagger.
    var typeDefinitionSwagger = swagger.definitions[definition]["type"];
    //console.log("typeDefinitionSwagger:" + typeDefinitionSwagger);

    if (typeDefinitionSwagger == 'object') {
        // Si es un objeto se obtienen las propiedades.
        var arrayProperties = Object.keys(swagger.definitions[definition]["properties"]);
        obj.type = "object";

        // Por cada propiedad se consultan sus items.
        for (var i = 0; i < arrayProperties.length; i++) {
            property = arrayProperties[i];
            //console.log("property:" + property);
            obj[property] = getNode(swagger.definitions[definition]["properties"][property]);

            //console.log("obj[" + property + "]");
            //console.log(obj[property]);
        }
    } else if (typeDefinitionSwagger == 'array') {
        obj.type = "array";
        //obj.item = []; **********************

        // Se obtiene el tipo de objecto del item del array.
        var typeOrRef = Object.keys(swagger.definitions[definition]["items"]);
        console.log("getDefinition() typeOrRef:" + typeOrRef);
        //console.log("getDefinition()typeOrRef[0]=" + typeOrRef[0]);
        if ( typeOrRef[0] == "$ref" ) {

            objProperties = Object.create({});
            objProperties.type= "object";

            var propertyRef = swagger.definitions[definition]["items"][typeOrRef[0]];
            var propertyDefinition = propertyRef.substring(propertyRef.lastIndexOf("/") + 1, propertyRef.length);
            objProperties.item["object"] = getDefinition(propertyDefinition);

            //obj.item["object"] = objProperties;  *******************
            obj["item"] = objProperties;

        } else if (typeOrRef[0] == "type") {
            objProperties = Object.create({});
            objProperties.type= "object";

            // Por cada propiedad se consultan sus items.
            var arrayProperties = Object.keys(swagger.definitions[definition]["items"]["properties"]);
            //console.log("getDefinition() arrayProperties:");
            //console.log(arrayProperties);
            for (var i = 0; i < arrayProperties.length; i++) {
                property = arrayProperties[i];
                //console.log("property:" + property);
                objProperties[property] = getNode(swagger.definitions[definition]["items"]["properties"][property]);
            }

            //obj.item["object"] = objProperties;   *******************
            obj["item"] = objProperties;
        }
    }
    //console.log("getDefinition.obj");
    //console.log(obj);
    return obj;
}
