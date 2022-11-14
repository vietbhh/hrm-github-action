const formatNumberToDisplay = (number) => {
  number = parseFloat(number)
  if (number === 0.0) {
    return 0
  }

  return number.toFixed(2)
}

export { formatNumberToDisplay }
