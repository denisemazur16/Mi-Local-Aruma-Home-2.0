function validateform(){
  const nombre = document.getElementById("fname").value
  const apellido = document.getElementById("lname").value
  const email = document.getElementById("mail").value
  const celular = document.getElementById("numero").value
  const comentarios = document.getElementById("coment").value

  if(!nombre || nombre.length < 3){
    alert("El nombre ingresado no es válido")
    return false
  }

  if(!apellido || apellido.length < 3){
    alert("El apellido ingresado no es válido")
    return false
  }

  if(!email || email.length < 3){
    alert("El mail ingresado no es válido")
    return false
  }
  
  if(!celular || celular.length < 10){
    alert("El número de celular ingresado no es válido")
    return false
  }

  // Si todo está OK:
  return true
}