module.exports = {

  // Server

  Timeout: {
    status: 503,
    message: 'Il nostro server è impegnato al momento, prova a riprovare tra poco.',
  },

  Network: {
    status: 503,
    message: 'NetworkError.',
  },

  Internal: {
    status: 500,
    message: 'Si è verificato un errore, prova a ricaricare la pagina, se il problema persiste contattare l\'amministratore.',
  },

  // Client

  NotFound: {
    status: 404,
    message: 'La risorsa che stai cercando non esiste!',
  },

}
