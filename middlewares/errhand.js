function errHand( err, req, res, next) {

  if(err.name === "ErrorNotFound") {
        res.status(404).json({
            message: "Error Not Found"
        })

  }
  else if (err.name === "wrongpassword") {
    res.status(400).json({
        message: "Wrong password or email"
    })
  }
  
  else {
        res.status(500).json({
            message: "Internal Server Error"
        })
  }

  console.log(err)
}

module.exports = errHand;