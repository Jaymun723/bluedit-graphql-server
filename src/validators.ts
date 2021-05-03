const regexEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i

export const nameValidator = (_name: string) => {
  let name = _name.trim()
  if (name.length < 3) {
    throw new Error("Name minimum length is 3.")
  } else if (name.length > 20) {
    throw new Error("Name maximum length is 20.")
  } else if (!/^[A-z0-9]*$/.test(name)) {
    throw new Error("Name must be alphanumeric.")
  }

  return name
}

export const emailValidator = (_email: string) => {
  let email = _email.trim().toLowerCase()
  if (!regexEmail.test(email)) {
    throw new Error("Email must be valid.")
  }

  return email
}

export const passwordValidator = (password: string) => {
  if (password.length < 3) {
    throw new Error("Password minimum length is 3.")
  } else if (password.length > 50) {
    throw new Error("Password maximum length is 50.")
  }

  return password
}

export const bioValidator = (_bio: string) => {
  let bio = _bio.trim()

  if (bio.length > 400) {
    throw new Error("Bio maximum length is 400.")
  }

  return bio
}

export const titleValidator = (_title: string) => {
  let title = _title.trim()

  if (title.length < 3) {
    throw new Error("Title minimum length is 3.")
  } else if (title.length > 40) {
    throw new Error("Title maximum length is 40.")
  }
  //  else if (!/^[A-z0-9]*$/.test(title)) {
  // throw new Error('Title must be alphanumeric.')
  // }

  return title
}

export const contentValidator = (content: string) => {
  if (content.length === 0) {
    throw new Error("No content provided.")
  }

  if (content.length > 10000) {
    throw new Error("The character limit is 10000.")
  }

  return content
}
