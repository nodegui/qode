// Copyright 2019 Atul R. All rights reserved.

#ifndef SRC_qode_H_
#define SRC_qode_H_
#include <memory>
#include <QApplication>

namespace qode {
    static QApplication* qtAppInstance;
    int Start(int argc, char* argv[]);
}  // namespace qode

#endif  // SRC_qode_H_
