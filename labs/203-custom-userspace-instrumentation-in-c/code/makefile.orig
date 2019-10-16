EXECS=ring
MPICC?=mpicc

all: ${EXECS}

ring: ring.c
	${MPICC} -o ring ring.c

clean:
	rm -f ${EXECS}
